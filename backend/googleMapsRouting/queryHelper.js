const { SocketRoom, StaffSocketFunctions } = require("../enums/enums");
const { response } = require("express");
const { DB } = require("../database");

const ORIGIN_ADDRESS = "1 Washington Sq, San Jose, CA 95192";
const MAX_DISTANCE_FROM_ORIGIN = 20;
const STORE_COORDS = {"latitude":37.3386564,"longitude":-121.8806354};
const STORE_ADDRESS = "1 Washington Sq, San Jose, CA 95112-3613, USA";
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
 * @returns undefined if failed, or address and lat lng in coords object if success.
 */
async function validateAddress(addressLine1, addressLine2, city, state, zipCode) {

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

    // Check if the address is accurate enough
    response = await response.json();
    let lat = response.result.geocode.location.latitude;
    let lng = response.result.geocode.location.longitude;
    const verdict = response.result.verdict.geocodeGranularity; 
    if (verdict !== 'PREMISE' && verdict !== 'SUB_PREMISE')   // If not accurate enough 400
        return undefined;
    else 
        return {
            address: response.result.address.formattedAddress,
            coordinates: {lat: lat, lng: lng}
    }; 
    // TODO reject store coords
}

/**
 * @param {*} address 
 * @returns 
 */
async function check_is_within_allowable_distance(address) {
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
        // set the intermediate points for the req body
        /*for (let address of addresses) {
            reqBody["intermediates"].push({ address })
        }*/
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
 * Sets the robot on route
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
    
    const seconds = 5;
    let coordIndex = 0;
    let legDuration = durations[leg];
    let decodedLeg = decodedRoute[leg];
    const incr = Math.ceil(((decodedLeg.length - 1) / legDuration) * seconds); // Move robot every X seconds

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
            
    }, 500); // TODO change this back to 5 seconds
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
    check_is_within_allowable_distance, 
    decodePolyline, 
    onRoute, 
    validateAddress
};
