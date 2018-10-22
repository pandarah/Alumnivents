const express = require('express');
const moment = require('moment');

const site = require('../SiteConstants');
const GenerateData = require('../api/GenerateData');
const Utils = require('../api/EventUtils');
const constants = require('../api/constants');

const router = express.Router();
const data = GenerateData(30);

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

router.get('/', (req, res) => {
    if (!req.session.hasOwnProperty('loggedIn')) {
        req.session.loggedIn = false;
    };

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

router.post('/create', (req, res) => {
    // console.log(req.body);
    // Add event to event table //INSERT INTO EVENTS (name, description, etc.)
    //get event ID for event that was just inserted - RETURNING id INTO :val:
    // Add host to host table  //INSERT INTO HOSTS (first name, last name, getEventID, etc.)
    // Add location to location table
    res.redirect('/');
});

router.post('/checkin', (req, res) => {
    // console.log(req.body);
    // Add attendee & event ID to attendees table
    res.redirect('/');
});

router.post('/feedback', (req, res) => {
    // console.log(req.body);
    // Add feedback & eventID to feedback table
    res.redirect('/');
});

router.get('/interested/:eventID', (req, res) => {
    // console.log(req.params);
    // Increment interested count of event at eventID
    res.redirect('/');
});

router.get('/accept/:eventID', (req, res) => {
    // console.log(req.params);
    // Remove pending flag on event at eventID
    res.redirect('/');
});

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
