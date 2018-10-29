const express = require('express');
const moment = require('moment');
const sqlite3 = require('sqlite3');

const site = require('../SiteConstants');
const eventUtils = require('../api/EventUtils');
const utils = require('../api/Utils');
const constants = require('../api/constants');
const actions = require('../api/Actions');

// const GenerateData = require('../api/GenerateData');
// const data = GenerateData(30);

const router = express.Router();

const libraries = {
    moment,
    utils,
};

router.get('/', (req, res) => {
    if (!req.session.hasOwnProperty('loggedIn')) {
        req.session.loggedIn = false;
    };
    
    //Get the events with refreshEvents. Since it's an async function, you have to wait (then) for a response
    actions.refreshEvents(req).then(() => {
        const data = req.app.locals.events; //get data from global variable

        const formOptions = {
            categories: constants.categories,
            majors: constants.majors,
            cities: eventUtils.compileLocations(data),
            states: constants.states,
            countries: constants.countries,
        };

        const events = eventUtils.applyFilters(req.app.locals.filters, data);

        //Have the response render the pug file index (for ui)
        res.render('Index', {
            name: site.name,
            loggedIn: req.session.loggedIn,
            printer: false,
            data: events,
            events: eventUtils.splitEvents(events),
            filters: req.app.locals.filters,
            date: utils.getCurrentDate(),
            formOptions,
            libraries,
        });
    }).catch(err => {
        res.send(err);
        console.error(err);
    })
});

router.post('/login', (req, res) => {
    if (req.body.password === site.password) {
        req.session.loggedIn = true;
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
    const data = req.app.locals.events;
    res.render('print', {
        name: site.name,
        loggedIn: true,
        printer: true,
        event: data[req.params.eventID - 1],
        date: utils.getCurrentDate(),
        libraries,
    });
});

router.post('/create', (req, res) => {
    actions.createEvent(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to add event to database', err)
    });
});

router.post('/checkin', (req, res) => {
    actions.eventCheckIn(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to check into event', err)
    });
});

router.post('/feedback', (req, res) => {
    actions.eventFeedback(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to provide feedback for event', err)
    });
});

router.get('/interested/:eventID', (req, res) => {
    actions.interestedInEvent(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to show interest in event', err)
    });
});

router.get('/accept/:eventID', (req, res) => {
    actions.approveEvent(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to approve event', err)
    });
});

router.get('/deny/:eventID', (req, res) => {
    actions.denyEvent(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to deny event', err)
    });
});

router.post('/filter', (req, res) => {
    req.app.locals.filters = req.body
    res.redirect('/');
});

router.get('/clear', (req, res) => {
    req.app.locals.filters = {};
    res.redirect('/');
});

module.exports = router;

