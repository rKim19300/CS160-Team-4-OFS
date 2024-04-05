//const fetch = (...args) =>
//	import('node-fetch').then(({default: fetch}) => fetch(...args));

const { response } = require("express");

const ORIGIN_ADDRESS = "1 Washington Sq, San Jose, CA 95192";
const MAX_DISTANCE_FROM_ORIGIN = 20;
const API_KEY = process.env.GOOGLE_API_KEY_BACKEND;


async function validateAddress(city, state, zipCode, address) {

}


async function check_is_within_allowable_distance(address) {
    try {
        let res = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=
		${address}&origins=${ORIGIN_ADDRESS}&units=imperial&key=${API_KEY}`);
		if (!res.ok) throw new Error("Failed to get data");
        let data = await res.json();
        // console.log(JSON.stringify(data, null, 4));
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


module.exports = { generateRouteData,  check_is_within_allowable_distance, decodePolyline};