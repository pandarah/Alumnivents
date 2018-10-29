const http = require('http');
const fs = require('fs');

const ip = fs.readFileSync("ip/ip.txt").toString().split('\n')[0]

const host = 'http://' + ip + ':3000/';

http.get(host, resp =>{
	let data = ''

	resp.on('data', chunk => {
		data += chunk
	})

	resp.on('end', () => {
		console.log(data)
	});

}).on("error", (err) => {
	console.log("Error: " + err.message)
})
