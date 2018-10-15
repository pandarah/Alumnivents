//Gets ip of current system
//and outputs to ip.txt
//
//The first line of ip.txt will contain
//correct ip address for server socket

'use strict';

var fs = require('fs')
var os = require('os');
var ifaces = os.networkInterfaces();

fs.writeFile("ip.txt", "", (err, data) => {
	if(err) console.log("error")
})

Object.keys(ifaces).forEach(function (ifname) {
	var alias = 0;

	ifaces[ifname].forEach(function (iface) {
		if ('IPv4' !== iface.family || iface.internal !== false) {
			// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
			return;
		}
      
		if (alias >= 1) {
			// this single interface has multiple ipv4 addresses
			//console.log(ifname + ':' + alias, iface.address);
			fs.appendFile("ip.txt", iface.address + '\n', (err, data) => {
				if(err) console.log("error")
			})
			//process.exit(0)

		} else {
			// this interface has only one ipv4 adress
			//console.log(ifname, iface.address);
			fs.appendFile("ip.txt", iface.address + '\n', (err, data) => {
				if(err) console.log("error")
			})
			//process.exit(0)
		}

		++alias;
	});
});
