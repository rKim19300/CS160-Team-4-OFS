const { SocketRoom } = require("../enums/enums");
const { response } = require("express");

const ORIGIN_ADDRESS = "1 Washington Sq, San Jose, CA 95192";
const MAX_DISTANCE_FROM_ORIGIN = 20;
const STORE_COORDS = {"latitude":37.3386564,"longitude":-121.8806354};
const STORE_ADDRESS = "1 Washington Sq, San Jose, CA 95112-3613, USA";
const API_KEY = process.env.GOOGLE_API_KEY_BACKEND;

/**
 * @param {*} addressLine1    The First address line
 * @param {*} addressLine2    The second address line
 * @param {*} city            The city 
 * @param {*} state           The state, usually supposed to be two letters
 * @param {*} zipCode         The zipcode
 * @throws ERROR              If google maps query fails
 * @returns Empty string if invalid, or a formatted address line if valid
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
    let latLng = response.result.geocode.location;
    const verdict = response.result.verdict.geocodeGranularity; 
    if (verdict !== 'PREMISE' && verdict !== 'SUB_PREMISE')   // If not accurate enough 400
        return "";
    else 
        return response.result.address.formattedAddress;
    // TODO reject store coords
}


async function check_is_within_allowable_distance(address) {
    try {
        let res = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=
		${address}&origins=${ORIGIN_ADDRESS}&units=imperial&key=${API_KEY}`);
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

(async () => {
    addresses = [
        "1085 E Brokaw Rd #30, San Jose, CA 95131",
        "2044 McKee Rd, San Jose, CA 95116",
        "601 N 4th St, San Jose, CA 95112"
    ];
    await generateRouteData(addresses);
})();

/**
 * Sets the robot on route
 * 
 * @param {*} polyLineList 
 * @param {*} io 
 */
function onRoute(polyLineList, io) {
    onRouteHelper(polyLineList, io, 0);
}

function onRouteHelper(polyLineList, io, i) {
    let coordIndex = 0;
    let decodedList = polyLineList[i];
    const incr = Math.round((decodedList.length - 1) / 5); // We will move the robot to a new lat every 5 seconds
    // const incr = Math.ceil(((decodedList.length - 1) / legDuration) * 5);

    const interval = setInterval(async () => {
        
        // Send the new location of the robot to anyone listening
        let coord = decodedList[coordIndex];
        io.to(SocketRoom.STAFF_ROOM).emit('updateRobot1', coord); // Emit to all in room
        io.emit('updateRobot1', coord); // emit to self 
        console.log(`Robot moved to ${JSON.stringify(coord)}`);
            
        coordIndex += incr; // Increment to the next location
        console.log(`Robot moved to ${coordIndex}`);
        
        // Check if should stop and move on to the next leg
        if (coordIndex > decodedList.length - 1) {
            clearInterval(interval);
            
            if (i < polyLineList.length - 1)
                onRouteHelper(polyLineList, io, ++i);
        }
            
    }, 5000);
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