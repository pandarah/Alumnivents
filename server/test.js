var http = require('http'),
	fs = require('fs')

var ip = fs.readFileSync("ip.txt").toString().split('\n')[0]

var host = 'http://' + ip + ':60818/'
http.get(host, (resp) => { //'http://129.210.16.71:60818/', (resp) => {
	let data = ''

	resp.on('data', (chunk) => {
		data += chunk
	})

	resp.on('end', () => {
		console.log(data)
	})
}).on("error", (err) => {
	console.log("Error: " + err.message)
})
