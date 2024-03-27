const router = require("express").Router();
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const { checkLoggedIn } = require("../middleware/authMiddleware");
const queryHelper = require('../googleMapsRouting/queryHelper');


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