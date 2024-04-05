const router = require("express").Router();
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const { checkLoggedIn, checkIsStaff } = require("../middleware/authMiddleware");
const { 
	check_is_within_allowable_distance,
	generateRouteData,
	decodePolyline
 } = require('../googleMapsRouting/queryHelper');


let robot1OnRoute = false;

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

router.get('/sendRobot', checkIsStaff, async (req, res) => {
	try {

		// Generate the route
		let data = await generateRouteData([
			"1085 E Brokaw Rd #30, San Jose, CA 95131",
			"2044 McKee Rd, San Jose, CA 95116",
			"601 N 4th St, San Jose, CA 95112"
		]);

		// Decode the paths
		decodedPaths = [];
		for (let i = 0; i < 4; i++) {
			result.push(await decodePolyline(data.routes[0].legs[i].polyline.encodedPolyline));
		}
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
 * @returns The address if valid
 */
router.post(`/validateAddress`, checkLoggedIn, async (req, res) => {

	let { address, city, state, zipCode } = req.body;

	const url = queryHelper.getHTTP('https://addressvalidation.googleapis.com/v1:validateAddress');

	const options = queryHelper.getOptions(
		method='POST',
		body=queryHelper.getAddressValidationBody(
			city=city,
			state=state, // In two letters 'CA'
			zipCode=zipCode,
			address=address
		)
	);

	try {
		const invalidAddressMsg = `Invalid Address.`;
		let response = await fetch(url, options);
		if (!response.ok) // 500 if query failed
			throw new Error('Failed to validate address');

		response = await response.json();
		const verdict = response.result.verdict.geocodeGranularity; 
		if (verdict !== 'PREMISE' && verdict !== 'SUB_PREMISE')   // If not accurate enough 400
			throw new Error(invalidAddressMsg);

		res.status(200).json({
			address: response.result.address.formattedAddress, 
		}); 
	} catch (err) {
		console.log(err);
		(err.message === invalidAddressMsg) ? 
			res.status(400).json(invalidAddressMsg) :
			res.status(500).json(`Oops! Something went wrong on our end.`);
	}
});




module.exports = router;