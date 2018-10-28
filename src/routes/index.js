const express = require('express');
const moment = require('moment');
const sqlite3 = require('sqlite3');

const site = require('../SiteConstants');
const GenerateData = require('../api/GenerateData');
const Utils = require('../api/EventUtils');
const constants = require('../api/constants');

const router = express.Router();
const data = GenerateData(30);//populates the database with 30 random hosts and events

var firstTime = true;
var currAlumniIndex;
var currEventIndex;


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

function getEventCount(db){
	db.get('SELECT count(*) as ct FROM Event',[],(err,row)=>{
		if(err){
			throw err;
		}
		currEventIndex = row['ct'];
	});
}

function getAlumniCount(db){
	db.get('SELECT count(*) as ct FROM Alumni',[],(err,row)=>{
		if(err){
			throw err;
		}
		currAlumniIndex = row['ct'];
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
		getEventCount(db);
		getAlumniCount(db);
		
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
    //console.log(req.params);
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
	let hostId = currAlumniIndex;
	let eventId = currEventIndex;
	let hostName = req.body.firstname + ' ' + req.body.lastname;

	db.serialize(()=>{
		db.run('INSERT INTO Event VALUES (?,?,?,?,?,?,?,?,?)', [eventId, req.body.name, req.body.date, req.body.endTime, req.body.description, req.body.category,0,0,(new Date).getTime()])
		.run('INSERT INTO Alumni VALUES (?,?,?,?)', [hostId, hostName, req.body.major, req.body.graduation])
		.run('INSERT INTO Host Values (?,?,?)', [hostId, eventId, req.body.email])
		.run('INSERT INTO Location VALUES (?,?,?,?,?,?)', [eventId, req.body.address, req.body.city, req.body.state, req.body.zipcode, req.body.country]);
	});
/*
	//TODO: For the final design we need to
		-Check to see if Alumni previously in system
		-Find a way to allow for run-time analysis on value of eventId and hostId
*/
	currAlumniIndex++;
	currEventIndex++;
	closeDB(db);
    res.redirect('/');
});
//TODO: FOR DEMO
router.post('/checkin', (req, res) => {
    //console.log(req.body);
	//For demo, we assume that people checking in have never been in the system before
	//Checking for previous entry into system requires fixing large asynchronous issue
    // Add attendee & event ID to attendees table
	let hostName = req.body.firstname + ' ' + req.body.lastname;
	let hostId = currAlumniIndex;
	db.serialize(()=>{
		db.run('INSERT INTO Alumni VALUES (?,?,?,?)', [hostId, hostname, req.body.major, req.body.graduation])
		.run('INSERT INTO Attendee VALUES (?,?)', [hostId, req.body.event]);
	});
	
	currAlumniIndex++;
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


/*	let sql = 'SELECT * FROM Event WHERE id = 1';
	db.get(sql,[], (err,row) => {
		if(err) {
			return console.error(err.message);
		}
		if(!row){
			console.log('WHAT');
		}
		else{
			console.log('TOP KEK');
		}
		
	});
	
	let sql = 'INSERT INTO Event VALUES (26,\'Bon Clay\', 5000,6000,\'lit bro\',\'Lightning\',0,0, 2006)';
	db.run(sql,[], function (err){
		if(err){
			return console.log(err);
		}

		console.log(this.lastID);
	});*/
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
	let db = openDB();
	let sql = 'UPDATE Event SET status = 1 WHERE id = ?';
	db.run(sql,[req.params.eventID],function (err){
		if(err){
			return console.error(err.message);
		}
		console.log(this.changes);
	});
    res.redirect('/');
});

//TODO: FOR DEMO
router.get('/deny/:eventID', (req, res) => {
    console.log(req.params.eventID);
    // Add denied flag to event at eventID
	let db = openDB();
	let sql = 'UPDATE Event SET status = 2 WHERE id = ?';
	db.run(sql,[req.params.eventID],function (err){
		if(err){
			return console.error(err.message);
		}
		console.log(this.changes);
	});
	
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

