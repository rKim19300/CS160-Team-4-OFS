

/**
 * @returns The URL for the HTTP key appended with the key
 */
function getHTTP(url) {
    return url + '?key=' + process.env.GOOGLE_API_KEY_BACKEND;
}

/**
 * 
 * @param {*} method  POST or GET
 * @param {*} body    The body of the request
 * @returns           The fetch request options
 */
function getOptions(method, body) {
    let options = {
		method: method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: body
	};
    return options;
}

function getAddressValidationBody(city, state, zipCode, address) {
		return JSON.stringify({
			address: {
				regionCode: "US",
				locality: city,
				administrativeArea: state, // In two letters 'CA'
				postalCode: zipCode,
				addressLines: [address]
			},
			enableUspsCass: true
		});
}


module.exports = { getHTTP, getOptions, getAddressValidationBody };