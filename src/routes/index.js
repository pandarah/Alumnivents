const express = require('express');
const moment = require('moment');
const sqlite3 = require('sqlite3');

const site = require('../SiteConstants');
const GenerateData = require('../api/GenerateData');
const Utils = require('../api/EventUtils');
const constants = require('../api/constants');

const router = express.Router();
const data = GenerateData(30);
const phpFile = 'oracleAccess.php';

var firstTime = true;

var currEventIndex = 0;
var currAlumniIndex = 0;

const libraries = {
    moment,
};

const formOptions = {
    categories: constants.categories,
    majors: constants.majors,
    cities: Utils.compileLocations(data),
    states: constants.states,
    countries: constants.countries,
};

//Since opening and closing happen a lot, better for quality control to make the lines into functions
function openDB(){
	let db = new sqlite3.Database('src/db/main.db',sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
		}

		console.log('Connected to main database');
	});
	return db;
}

function closeDB(db){
	db.close((err) => {
		if(err){
			return console.error(err.message);
		}
		console.log('Close Connection to main database');
	});
}

router.get('/', (req, res) => {
    if (!req.session.hasOwnProperty('loggedIn')) {
        req.session.loggedIn = false;
    };
	//this if statement gets current value of the Index we should be using in event of server shutdown
	//this method assumes that an event's id and a person's id can never change
	if (firstTime){
		let db = openDB();
		db.all('SELECT count(*) as ct FROM Event',[],(err,rows)=>{
			if (err) {
				throw err;
			}
			currEventIndex = rows[0]['ct'];
		});

		db.all('SELECT count(*) as ct FROM Alumni',[],(err,rows)=>{
			if(err){
				throw err;
			}
			currAlumniIndex = rows[0]['ct'];
		});
		
		firstTime = !firstTime;
		closeDB(db);
	}
		
    const events = Utils.applyFilters(req.app.locals.filters, data);
    res.render('index', {
        name: site.name,
        loggedIn: req.session.loggedIn,
        printer: false,
        events: Utils.splitEvents(events),
        filters: req.app.locals.filters,
        date: new Date(),
        formOptions,
        libraries,
    });
});

router.post('/login', (req, res) => {
    if (req.body.password === site.password) {
        req.session.loggedIn = true
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.loggedIn = false;
    }
    res.redirect('/');
});

router.get('/print/:eventID', (req, res) => {
    // console.log(req.params);
    res.render('print', {
        name: site.name,
        loggedIn: true,
        printer: true,
        event: data[req.params.eventID],
        date: new Date(),
        libraries,
    })
});

//TODO: FOR DEMO
router.post('/create', (req, res) => {
    console.log(req.body);
	let db = openDB();
	// Add event to event table //INSERT INTO EVENTS (name, description, etc.)
	let sql = 'INSERT INTO Event VALUES (?,?,?,?,?,?,?,?,?)';
	db.run(sql, [currEventIndex++, req.body.name, req.body.date, req.body.endTime, req.body.description, req.body.category,0,0,(new Date).getTime()], function(err){
		if(err){
			return console.log(err.message);
		}
		console.log('Event Inserted: '+ eventId);
	});
    
    // Add host to host table  
	sql = 'INSERT INTO Alumni VALUES (?,?,?,?)';
	db.run(sql, [currAlumniIndex, (req.body.firstname + ' ' + req.body.lastname), req.body.major, req.body.graduation], function(err){
		if(err){
			console.log(err.message);
		}
	});

	sql = 'INSERT INTO Host Values (?,?,?)';
	db.run(sql, [currAlumniIndex, currEventIndex - 1, req.body.email], function(err){
		if(err){
			console.log(err.message);
		}
		else{
			currAlumniIndex++;
		}
		
	});


    // Add location to location table
	sql = 'INSERT INTO Location VALUES (?,?,?,?,?,?)'
	db.run(sql, [eventId, req.body.address, req.body.city, req.body.state, req.body.zipcode, req.body.country], function(err){
		if(err){
			return console.log(err.message);
		}
	});


	closeDB(db);
    res.redirect('/');
});
//TODO: FOR DEMO
router.post('/checkin', (req, res) => {
    //console.log(req.body);
    // Add attendee & event ID to attendees table
    res.redirect('/');
});

router.post('/feedback', (req, res) => {
    // console.log(req.body);
    // Add feedback & eventID to feedback table
    res.redirect('/');
});

router.get('/interested/:eventID', (req, res) => {
    //console.log(req.params);
	let db = openDB();
    // Increment interested count of event at eventID
	/*$.ajax({ url: 'oracleAccess.php',
        data: {function2call: 'addInterest', var1:req.params},
        type: 'post',
        success: function(output) {
             alert(output);
    	}
	});*/

	closeDB(db);
    res.redirect('/');
	
});

//TODO: FOR DEMO
router.get('/accept/:eventID', (req, res) => {
    // console.log(req.params);
    // Remove pending flag on event at eventID
    res.redirect('/');
});

//TODO: FOR DEMO
router.get('/deny/:eventID', (req, res) => {
    // console.log(req.params);
    // Add denied flag to event at eventID
    res.redirect('/');
});

router.post('/filter', (req, res) => {
    // console.log(req.body);
    req.app.locals.filters = req.body
    res.redirect('/');
});

router.get('/clear', (req, res) => {
    req.app.locals.filters = {};
    res.redirect('/');
});

module.exports = router;
