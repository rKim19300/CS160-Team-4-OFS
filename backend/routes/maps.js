const router = require("express").Router();
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const { checkLoggedIn, checkIsStaff } = require("../middleware/authMiddleware");
const { 
	check_is_within_allowable_distance,
	generateRouteData,
	decodePolyline,
	onRoute,
	validateAddress
 } = require('../googleMapsRouting/queryHelper');


router.get('/generateRouteData', checkIsStaff, async (req, res) => {
	try {
		let data = await generateRouteData([
			"1085 E Brokaw Rd #30, San Jose, CA 95131",
			"2044 McKee Rd, San Jose, CA 95116",
			"601 N 4th St, San Jose, CA 95112"
		]);
		console.log(data);
		res.status(200).json(data); 
	}
	catch (err) {
		res.status(500).json(`Oops! Something went wrong on our end.`);
	}

});

// TODO change this into a post request
router.get('/sendRobot', checkIsStaff, async (req, res) => {
	try {

		// TODO the post parameters are: robot_id
		let { robot_id } = req.body;

		// Check if the robot has a route
		await DB.

		// Check if the robot is already ON_ROUTE

		// Generate the route
		// TODO get the addresses from the robot's route
		let data = await generateRouteData([
			"1085 E Brokaw Rd #30, San Jose, CA 95131",
			"2044 McKee Rd, San Jose, CA 95116",
			"601 N 4th St, San Jose, CA 95112"
		]);

		// Decode the paths
		decodedPaths = [];
		for (let i = 0; i < 4; i++) {
			await decodedPaths.push(await decodePolyline(data.routes[0].legs[i].polyline.encodedPolyline));
		}

		// Set the robot on the path
		let staffIO = await req.app.get('staffIO');

		// TODO pass the 
		await onRoute(decodedPaths, staffIO);

		res.status(200).json(decodedPaths);
	}
	catch (err) {
		res.status(520).json("Either the data is invalid, or something went wrong.");
		console.error(`ERROR WHEN SENDING ROBOTS: ${err}`);
	}
});

// Used to test the decodePolyline() function
router.post('/decodePolyline', checkIsStaff, async (req, res) => {
	try {
		let { encodedPolyline } = req.body;
		let data = await decodePolyline(encodedPolyline);
		res.status(200).json(data);
	}
	catch {
		res.status(520).json("Either the data is invalid, or something went wrong.");
	}
})

/**
 * Validates the address
 * 
 * @returns The address and it's lat lng coordinates if success
 */
router.post(`/validateAddress`, checkLoggedIn, async (req, res) => {

	let { addressLine1, addressLine2, city, state, zipCode } = req.body;

	try {

		// Check If the address is valid
		let response = await validateAddress(addressLine1, addressLine2, city, state, zipCode);
		if (response === undefined) 
			return res.status(400).json("Invalid address: Address is either entered incorrectly or\
											not deliverable");
		const address = response.address;
		const coordinates = response.coordinates; 

		// Check if the address is within the correct distance
		const inRange = await check_is_within_allowable_distance(address);
		if (!inRange) 
			return res.status(400).json("Address is not within 20 miles of store!");

		// Return the formatted address
		return res.status(200).json(coordinates); 
	} catch (err) {
		console.log(err);
		return res.status(500).json(`Oops! Something went wrong on our end. Try again in 60 seconds.`);
	}
});


module.exports = router;