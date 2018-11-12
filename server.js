const path = require('path');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

const indexRouter = require('./src/routes/index');
const database = require('./src/api/Database');

const app = express();
app.set('port', process.env.PORT || 60818)

// Database Setup
const db = new sqlite3.Database('./alumnivents.db');
database.createAsyncDB(db);
app.locals.db = db;

// Port Setup
const port = process.env.PORT || '3000';
app.set('port', port);

// View Engine Setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

// Sessions Setup
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
    secret: 'Pumpkin Spice Latte',
    resave: true,
    saveUninitialized: false,
}));

// Reqest/Response Body Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static File Path (Run in broswer)
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.use('/', indexRouter);

// Local Variable Initialization
app.locals.filters = {};

// Enable CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Catch 404 errors and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error Handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('Error');
});

const server = http.createServer(app);
server.listen(port, () => console.log('Listening on port ' + port));
server.on('exit', code => {
    console.log(`Exit code ${code}`);
});
