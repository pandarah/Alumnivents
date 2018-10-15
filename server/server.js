var express = require('express'),
	url = require('url'),
	http = require('http'),
	bodyParser = require('body-parser')


var app = module.exports = express()
app.set('port', process.env.PORT || 60818)

app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// enable CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/asdf', async(req, res) => {
	res.send('asdf')
})


var server = http.createServer(app)
server.listen(app.get('port'), () => console.log("Listening on port " + app.get('port')))

process.on('exit', code => {
	console.log(`Exit code ${code}`)
})
