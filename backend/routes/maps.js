const router = require("express").Router();
const { DB } = require("../database");
const { SocketRoom, StaffSocketFunctions } = require("../enums/enums");
const { checkLoggedIn, checkIsStaff } = require("../middleware/authMiddleware");
const { 
	checkIsWithinAllowableDistance,
	generateRouteData,
	decodePolyline,
	validateAddress,
	sendRobot
 } = require('../googleMapsRouting/queryHelper');



/**
 * Gets to robots and all of their data
 */
router.get('/getRobots', checkIsStaff, async (req, res) => {
	try {
		let data = await DB.get_all_robots();
		res.status(200).json(data); 
	}
	catch (err) {
		console.log(`ERROR WHEN GETTING ROBOTS ${err}`)
		res.status(500).json(`Oops! Something went wrong on our end.`);
	}
});

router.post('/getRobotOrders', checkIsStaff, async (req, res) => {
	try {
		let { robot_id } = req.body;

		let route = await DB.get_route(robot_id); // Get robot's route
		if (route === undefined) {
			res.status(200).send([]);
			return;
		}

		let orders = await DB.get_route_orders(route.route_id); // Get Robot's orders

		res.status(200).send(orders);
	}
	catch (err) {
		console.log(`ERROR WHEN GETTING ROBOT ORDERS ${err}`);
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

		// Decode the polylines
		for (let i = 0; i < polylines1.length; i++)
			polylines1[i] = await decodePolyline(polylines1[i]);
		for (let i = 0; i < polylines2.length; i++)
			polylines2[i] = await decodePolyline(polylines2[i]);

		res.status(200).json({robot1: polylines1, robot2: polylines2});
	}
	catch (err) {
		console.log(`ERROR WHEN DECODING POLYLINES ${err}`);
		res.status(500).json("Something went wrong on our end, please try again later.");
	}
})

router.post('/sendRobot', checkIsStaff, async (req, res) => {
	try {

		let { robot_id } = req.body;

		// Check if the robot has a route
		if (!(await DB.has_route(robot_id))) {
			res.status(400).send(`ERROR: A route has not been assigned this robot`);
			return;
		}

		// Check if the robot is already ON_ROUTE
		if ((await DB.is_on_route(robot_id))) {
			res.status(400).send("ERROR: Robot is already on route");
			return;
		}

		staffIO = req.app.get('staffIO')

		await sendRobot(robot_id, staffIO);

		res.status(200).json();
	}
	catch (err) {
		res.status(500).json(`Something went wrong on our end, please try again in 60 seconds. 
								If this issue persists after a few attempts, please call tech support
								at 098-765-4321.`);
		console.error(`ERROR WHEN SENDING ROBOTS: ${err}`);
	}
});

/**
 * Validates the address
 * 
 * @returns The address and it's lat lng coordinates if success
 */
router.post(`/validateAddress`, async (req, res) => {

	let { addressLine1, addressLine2, city, state, zipCode } = req.body;

	try {

		// Check If the address is valid
		let response = await validateAddress(addressLine1, addressLine2, city, state, zipCode);
		if (response.errMessage.length > 0) 
			return res.status(400).json(`Invalid Address: ${response.errMessage}`);
		const address = response.address;
		const coordinates = response.coordinates; 

		// Check if the address is within the correct distance
		const inRange = await checkIsWithinAllowableDistance(address);
		if (!inRange) 
			return res.status(400).json("Address is not within 20 miles of store!");

		// Return the formatted address
		return res.status(200).json({
			coordinates: coordinates, 
			address: address
		}); 
	} catch (err) {
		console.log(`ERROR WHEN VALIDATING ADDRESS ${err}`);
		res.status(500).json(`Oops! Something went wrong on our end. Try again in 60 seconds. 
										If the issue persists, please make us aware of the 
										issue at ofsdelivery@ofs.com.`);
	}
});


module.exports = router;
