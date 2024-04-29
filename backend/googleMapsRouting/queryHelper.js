const { SocketRoom, StaffSocketFunctions } = require("../enums/enums");
const { response } = require("express");
const { DB } = require("../database");

const ORIGIN_ADDRESS = "1 Washington Sq, San Jose, CA 95112, USA";
const MAX_DISTANCE_FROM_ORIGIN = 20;
const STORE_COORDS = {"latitude":37.3386564,"longitude":-121.8806354};
const API_KEY = process.env.GOOGLE_API_KEY_BACKEND;
const encodingMap = {
    ' ': '%20',
    '"': '%22',
    '<': '%3C',
    '>': '%3E',
    '#': '%23',
    '%': '%25',
    '|': '%7C'
};

/**
 * @param {*} addressLine1    The First address line
 * @param {*} addressLine2    The second address line
 * @param {*} city            The city 
 * @param {*} state           The state, usually supposed to be two letters
 * @param {*} zipCode         The zipcode
 * @throws ERROR              If google maps query fails
 * @returns An object with and errMessage if failed, 
 *          or address and lat lng in coords object if success (errMessage empty).
 */
async function validateAddress(addressLine1, addressLine2, city, state, zipCode) {

    // Make sure that the zipcode is 5 digits long
    if (zipCode.toString().length !== 5)
        return {errMessage: `Make sure your zipcode is exactly 5 digits`};

    // Query to make sure that the address is deliverable
    const url = `https://addressvalidation.googleapis.com/v1:validateAddress`;
    const reqBody = {
        "address": {
            "regionCode": "US",
            "locality": city,
            "administrativeArea": state,
            "postalCode": zipCode,
            "addressLines": [addressLine1, addressLine2]
          },
          "enableUspsCass": true
    };

    // Fetch the data
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask": "*"
        },
        body: JSON.stringify(reqBody)
    });
    if (!response.ok) // 500 if query failed
        throw new Error("Google Maps request failed");

    response = await response.json(); // Convert to json

    // Fix Address
    const address = await fixAddress(response.result.geocode.placeId);
    
    // Check if the address is accurate enough or is not the store
    let lat = response.result.geocode.location.latitude;
    let lng = response.result.geocode.location.longitude;
    const verdict = response.result.verdict.geocodeGranularity; 
    if ((verdict !== 'PREMISE' && verdict !== 'SUB_PREMISE') || (address === ORIGIN_ADDRESS))  
        return {errMessage: 'Sorry, it seems that your address is non-deliverable'};
    return {
        address: address,
        coordinates: {lat: lat, lng: lng},
        errMessage: ''
    }; 
}

/**
 * @param {*} address 
 * @returns 
 */
async function checkIsWithinAllowableDistance(address) {
    try {
        const encodedAddress = encodeAddress(address); // Encode unsafe characters
        let res = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=
		${encodedAddress}&origins=${ORIGIN_ADDRESS}&units=imperial&key=${API_KEY}`);
		if (!res.ok) throw new Error("Failed to get data");
        let data = await res.json();
        let distanceMeters = data["rows"][0]["elements"][0]["distance"]["value"];
        let distanceMiles = distanceMeters * 0.000621371;
        return distanceMiles <= MAX_DISTANCE_FROM_ORIGIN;
    } catch (err) {
        // will hit this catch statement if the `address` is not a real address
        console.log(`GOOGMAPS: ERROR WHEN CHECKING DISTANCE FROM ORIGIN: ${err}`);
        return false;
    }
}

async function fixAddress(placeId) {
    const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address&key=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to get data");
    return (await res.json()).result.formatted_address;
}

/**
 * Helper function that encodes an address, converting the unsafe characters to their 
 * encoded versions. 
 * 
 * @param {*} address 
 */
function encodeAddress(address) {
    return address.split('').map(char => {
        return encodingMap[char] || char;
    }).join('');
}

async function generateRouteData(addresses) {
    const reqBody = {
        "origin":{
            "address": ORIGIN_ADDRESS
        },
        "destination":{
            "address": ORIGIN_ADDRESS
        },
        "intermediates": addresses.map(address => ({ address })),
        "travelMode": "DRIVE",
        "routingPreference": "TRAFFIC_AWARE",
        "computeAlternativeRoutes": false,
        "routeModifiers": {
            "avoidTolls": false,
            "avoidHighways": false,
            "avoidFerries": false
        },
        "optimizeWaypointOrder": true,
        "languageCode": "en-US",
        "units": "IMPERIAL"
    };
    try {
        // make the request
        let res = await fetch(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-Goog-Api-Key": API_KEY,
                "X-Goog-FieldMask": "routes,routes.distanceMeters,routes.polyline.encodedPolyline,routes.optimized_intermediate_waypoint_index"
                //"routes.duration,routes.legs"
            },
            body: JSON.stringify(reqBody)
        });
		if (!res.ok) throw new Error("Fetch Failed");
        let data = await res.json();
        return data;
    } catch (err) {
        console.log(`GOOGMAPS: ERROR WHEN GENERATING ROUTES: ${err}`);
    }
}

/**
 * @param {*} robot_id The robot being sent onRoute
 *                     Assumption: Have already checked that the robot has 
 *                                 a route and that it is not already ON_ROUTE
 * @param {*} staffIO  The socket used to update the robot's location
 */
async function sendRobot(robot_id, staffIO) {

    	// Get the robot's route
		let route = await DB.get_route(robot_id);
		const route_id = route.route_id;

		// Generate the route
		let addresses = await DB.get_route_addresses(route_id);

		// Generate the route data from the addresses
		let data = await generateRouteData(addresses);

		const optimizedWaypointOrder = data.routes[0].optimizedIntermediateWaypointIndex;
		let encodedPolylines = []; // The encoded polyline paths of each leg (the leg number is the index)
		let durations = []; // The durations of each leg

		// Populate the polyline and durations arrays
		let legs = data.routes[0].legs;
		for (let i = 0; i < legs.length; i++) {
			encodedPolylines.push(legs[i].polyline.encodedPolyline);
			durations.push(parseInt(data.routes[0].legs[i].duration));
		}

		// Populate the database the route with the leg data
		await DB.populate_route_data(
				robot_id, 
				addresses, 
				encodedPolylines, 
				durations, 
				optimizedWaypointOrder
			);

		// Decode the paths
		decodedPaths = [];
		for (let i = 0; i < encodedPolylines.length; i++)
			await decodedPaths.push(await decodePolyline(encodedPolylines[i]));

		// Tell anyone listening to update their polylines
		staffIO.to(SocketRoom.STAFF_ROOM).emit('updatePolylines', []); // Emit to all in room
		staffIO.emit('updatePolylines', []); // emit to self 

		// Send the robot on the route
		await onRoute(robot_id, route_id, durations, decodedPaths, staffIO);
}

/**
 * Sets the robot on route
 * 
 * Assumption: The legs are indexeds starting at 0, and do not skip integers
 * 
 * @param {*} robot_id      The robot on the route being traversed
 * @param {*} route_id      The ID of the route being traversed
 * @param {*} durations     An array containing the durations of each of the legs in seconds
 * @param {*} decodedRoute  A 2D array of decoded polylines each representing a leg
 * @param {*} io            The socket being used
 */
function onRoute(robot_id, route_id, durations, decodedRoute, io) {
    onRouteHelper(robot_id, route_id, durations, decodedRoute, io, 0);
}

function onRouteHelper(robot_id, route_id, durations, decodedRoute, io, leg) {
    
    const update_rate = 1; // in seconds
    let coordIndex = 0;
    let legDuration = durations[leg];
    let decodedLeg = decodedRoute[leg];
    const incr = Math.ceil(((decodedLeg.length) / legDuration) * update_rate); // Move robot every X seconds

    const interval = setInterval(async () => {
        
        // Update the robot location in the database
        let coord = decodedLeg[coordIndex];
        await DB.update_robot_location(robot_id, coord.lat, coord.lng);

        // Send the update for the robot location to anyone that is listening
        io.to(SocketRoom.STAFF_ROOM).emit('updateRobots', coord); // Emit to all in room
        io.emit('updateRobots', coord); // emit to self 
        console.log(`Robot (ID: ${robot_id}) moved to ${JSON.stringify(coord)}`);
            
        coordIndex += incr; // Increment to the next location
        
        // Check if should stop and move on to the next leg
        if (coordIndex > decodedLeg.length - 1) {
            clearInterval(interval);
            
            // Update the status of the order and remove it from the database
            await DB.finish_route_leg(route_id, leg);
            console.log(`leg ${leg} removed from route ${route_id}`);

            // Tell anyone listening to update their orders and polylines
            io.to(SocketRoom.STAFF_ROOM).emit('updatePolylines', coord); // Emit to all in room
            io.emit('updatePolylines', coord); // emit to self 
            io.to(SocketRoom.STAFF_ROOM).emit('updateOrders', coord); // Emit to all in room
            io.emit('updateOrders', coord); // emit to self 

            // Move to the next leg if there is one
            if (leg < decodedRoute.length - 1)
                onRouteHelper(robot_id, route_id, durations, decodedRoute, io, ++leg);
            else {
                await DB.delete_route(route_id);
                console.log(`route (ID ${route_id}) finished`);
            }
        }
            
    }, update_rate * 1000); // TODO change this back to 5 seconds
}

/**
 * Recovers the robot if it was ON_ROUTE what the database was shut off.
 * Assumption: Already checked that the Robot status is ON_ROUTE
 * 
 * @param {*} robot_id   The entire robot object
 * @param {*} staffIO   The IO for the socket
 */
async function recoverRobot(robot, staffIO) {
    try {
        const route_id = robot.route_id

        // Get the durations and polylines of the route
        console.log("Querying the route polylines and durations. . .");
        let polylines = await DB.get_route_polylines(route_id);
        let durations = await DB.get_route_durations(route_id);

        // Decode the polylines
        console.log("Decoding the route polylines. . .");
        for (let i = 0; i < polylines.length; i++) 
            polylines[i] = (await decodePolyline(polylines[i]));
        
        // Find the index where the robot stopped within the first polyline 
        let stop_index = 0;
        let first_polyline = polylines[0];
        while ((first_polyline[stop_index].lat != robot.latitude) && 
                (first_polyline[stop_index].lng != robot.longitude)) {
            stop_index++;
            if (stop_index > first_polyline.length) throw new Error(`Failed to find first index`);
        }

        // Adjust the duration of the first leg 
        durations[0] = Math.ceil((1 - ((stop_index + 1) / first_polyline.length)) * durations[0]);

        // Slice the polyline array of the first leg
        polylines[0] = polylines[0].slice(stop_index, polylines[0].length);

        // Update the etas of the legs in the database
        /*
            NOTE: We don't update the duration of first leg in database because 
                  subsequent shutoffs could unnecessarily shrink the duration toward 0. 
        */
        await DB.recover_robot_route_data(route_id, durations);

        // Send robot ON_ROUTE
        console.log(`Sending robot (ID ${robot.robot_id}) ON_ROUTE`);
        await onRoute(robot.robot_id, route_id, durations, polylines, staffIO);
    } 
    catch (err) {
        console.log(`ERROR WHEN RECOVERING ROBOT: ${err}`);
    }


}

async function decodePolyline(encodedPolyline) {
    let points = [];
    let index = 0;
    let lat = 0;
    let lng = 0;
  
    while (index < encodedPolyline.length) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encodedPolyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;
  
      shift = 0;
      result = 0;
      do {
        b = encodedPolyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;
  
      points.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return points;
}

(async () => {

})();


module.exports = { 
    generateRouteData, 
    checkIsWithinAllowableDistance, 
    decodePolyline, 
    validateAddress,
    sendRobot, 
    recoverRobot
};
