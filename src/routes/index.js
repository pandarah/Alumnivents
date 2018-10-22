const express = require('express');
const moment = require('moment');

const site = require('../SiteConstants');
const GenerateData = require('../api/GenerateData');
const Utils = require('../api/EventUtils');
const formOptions = require('../api/constants');

const router = express.Router();

const libraries = {
    moment,
};

const events = GenerateData(30);

router.get('/', (req, res) => {
    if (!req.session.hasOwnProperty('loggedIn')) {
        req.session.loggedIn = false;
    };

    res.render('index', {
        name: site.name,
        loggedIn: req.session.loggedIn,
        printer: false,
        events: Utils.splitEvents(events),
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
    console.log(req.params);
    
    res.render('print', {
        name: site.name,
        loggedIn: true,
        printer: true,
        event: events[req.params.eventID],
        date: new Date(),
        libraries,
    })
});

router.post('/create', (req, res) => {
    console.log(req.body);
    // Add event to event table
    res.redirect('/');
});

router.post('/checkin', (req, res) => {
    console.log(req.body);
    // Add check-in to check-in table
    // Add checkinID to event at eventID
    res.redirect('/');
});

router.post('/feedback', (req, res) => {
    console.log(req.body);
    // Add feedback to feedback table
    // Add feedbackID to event at eventID
    res.redirect('/');
});

router.get('/interested/:eventID', (req, res) => {
    console.log(req.params);
    // Increment interested count of event at eventID
    res.redirect('/');
});

router.get('/accept/:eventID', (req, res) => {
    console.log(req.params);
    // Remove pending flag on event at eventID
    res.redirect('/');
});

router.get('/deny/:eventID', (req, res) => {
    console.log(req.params);
    // Add denied flag to event at eventID
    res.redirect('/');
});

module.exports = router;
