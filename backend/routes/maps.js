const router = require("express").Router();
const { DB } = require("../database");
const { SocketRoom, StaffSocketFunctions } = require("../enums/enums");
const { checkLoggedIn, checkIsStaff } = require("../middleware/authMiddleware");
const { 
	check_is_within_allowable_distance,
	generateRouteData,
	decodePolyline,
	onRoute,
	validateAddress
 } = require('../googleMapsRouting/queryHelper');


/*router.get('/generateRouteData', checkIsStaff, async (req, res) => {
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

});*/

/**
 * Gets to robots and all of their data
 */
router.get('/getRobots', checkIsStaff, async (req, res) => {
	try {
		let data = await DB.get_all_robots();
		// TODO handle query fail
		res.status(200).json(data); 
	}
	catch (err) {
		res.status(500).json(`Oops! Something went wrong on our end.`);
	}
});

/**
 * Gets the decoded polylines of each robot if there are any
 * 
 * Assumption: There are two robots
 */
router.get('/getDecodedPolylines', checkIsStaff, async (req, res) => {
	try {

		// Get all robots
		let robots = await DB.get_all_robots();

		// Get the route_ids of the robots
		let polylines1 = await DB.get_robot_route_polylines(robots[0].robot_id);
		let polylines2 = await DB.get_robot_route_polylines(robots[1].robot_id);
		console.log(`Polylines1: ${JSON.stringify(polylines1)}`);
		console.log(`Polylines2: ${JSON.stringify(polylines2)}`);


		// Decode the polylines
		for (let i = 0; i < polylines1.length; i++)
			polylines1[i] = await decodePolyline(polylines1[i]);
		for (let i = 0; i < polylines2.length; i++)
			polylines2[i] = await decodePolyline(polylines2[i]);

		res.status(200).json({robot1: polylines1, robot2: polylines2});
	}
	catch {
		res.status(500).json("Something went wrong on our end, please try again later.");
	}
})

router.post('/sendRobot', checkIsStaff, async (req, res) => {
	try {

		let { robot_id } = req.body;

		// Check if the robot has a route
		if (!(await DB.has_route(robot_id))) {
			res.status(400).send("ERROR: A route has not been assigned to a robot");
			return;
		}

		// Check if the robot is already ON_ROUTE
		if ((await DB.is_on_route(robot_id))) {
			res.status(400).send("ERROR: Robot is already on route");
			return;
		}

		// Get the robot's route
		let route = await DB.get_route(robot_id);
		const route_id = route.route_id;

		// Generate the route
		// TODO Get the addresses from the robot's route

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

		// Set the robot on the path
		let staffIO = await req.app.get('staffIO');

		// Tell anyone listening to update their polylines
		staffIO.to(SocketRoom.STAFF_ROOM).emit('updatePolylines', []); // Emit to all in room
		staffIO.emit('updatePolylines', []); // emit to self 

		// Send the robot on the route
		await onRoute(robot_id, route_id, durations, decodedPaths, staffIO);

		res.status(200).json(decodedPaths);
	}
	catch (err) {
		res.status(500).json("Something went wrong on our end, please try again later.");
		console.error(`ERROR WHEN SENDING ROBOTS: ${err}`);
	}
});

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