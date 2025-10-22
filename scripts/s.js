const http = require('https');

const options = {
	method: 'GET',
	hostname: 'instagram-social-api.p.rapidapi.com',
	port: null,
	path: '/v1/posts?username_or_id_or_url=mrbeast',
	headers: {
		'x-rapidapi-key': '8449ada219mshb1bc7b7a76025b3p1d6af0jsn7725dcf14772',
		'x-rapidapi-host': 'instagram-social-api.p.rapidapi.com'
	}
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});

req.end();