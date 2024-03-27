const router = require("express").Router();
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const { checkLoggedIn } = require("../middleware/authMiddleware");


router.post(`/validateAddress`, checkLoggedIn, async (req, res) => {

	let { address, city, state, zipCode } = req.body;

	const url = 'https://addressvalidation.googleapis.com/v1:validateAddress?key=';
    const apiKey = process.env.GOOGLE_API_KEY_BACKEND;

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			address: {
				regionCode: "US",
				locality: city,
				administrativeArea: state, // In two letters 'CA'
				postalCode: zipCode,
				addressLines: [address]
			},
			enableUspsCass: true
		})
	};

	try {
		let response = await fetch(url + apiKey, options);
		if (!response.ok) {
            throw new Error('Failed to validate address');
        }
		response = await response.json();
		console.log(response);
		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({msg: `Oops! Something went wrong on our end.`});
	}
});


module.exports = router;