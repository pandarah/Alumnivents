//The general goal of the functions within this file is to correctly route actions.
const express = require('express');
const moment = require('moment');

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

/**
 * @function getIndex
 * @summary Routes the get request of / to index
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
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

        const events = {};
        eventUtils.applyFilters(req.app.locals.filters, data)
            .forEach(event => {
                events[event.id] = event;
            });

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

        // Reset filters after search
	    req.app.locals.filters = {};
    }).catch(err => {
        res.send(err);
        console.error(err);
    })
});

/**
 * @function postLogin
 * @summary Routes the get request of /login to login by setting the session loggedIn to true
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
router.post('/login', (req, res) => {
    if (req.body.password === site.password) {
        req.session.loggedIn = true;
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

/**
 * @function getLogout
 * @summary Routes the get request of /logout to logout by setting the session loggedIn to false
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
router.get('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.loggedIn = false;
    }
    res.redirect('/');
});

/**
 * @function getPrint
 * @summary Routes the get request of /print to login by rendering the print pane
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
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

/**
 * @function getReport
 * @summary Routes the get request of /report to report which will filter the events needed and split them according to 
 * upcoming and past events, official and unofficial events. Then renders the report pane
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
router.get('/report', (req, res) => {
    //Get the events with refreshEvents. Since it's an async function, you have to wait (then) for a response
    actions.refreshEvents(req).then(() => {
        const data = req.app.locals.events; //get data from global variable

        const events = {};
        eventUtils.applyFilters(req.app.locals.filters, data)
            .forEach(event => {
                let total = 0, count = 0;
                event.comments.forEach(comment => {
                    total += comment.rating;
                    count++;
                })
                event.averageRating = count ? Math.round((total / count) * 10) / 10 : 0;
                events[event.id] = event;
            });

        const eventCounts = { upcoming: { official: 0, unofficial: 0 }, past: { official: 0, unofficial: 0 } };
        const splitEvents = eventUtils.splitEvents(events);
        splitEvents.upcoming.forEach(event => {
            if (event.host.name === 'Alumni Office') {
                eventCounts.upcoming.official++;
            } else {
                eventCounts.upcoming.unofficial++;
            }
        });
        splitEvents.past.forEach(event => {
            if (event.host.name === 'Alumni Office') {
                eventCounts.past.official++;
            } else {
                eventCounts.past.unofficial++;
            }
        });

        //Have the response render the pug file index (for ui)
        res.render('report', {
            name: site.name,
            loggedIn: req.session.loggedIn,
            printer: false,
            data: events,
            events: eventUtils.splitEvents(events),
            eventCounts,
            filters: req.app.locals.filters,
            date: utils.getCurrentDate(),
            libraries,
        });

        // Reset filters after search
        req.app.locals.filters = {};
    }).catch(err => {
        res.send(err);
        console.error(err);
    });
});

/**
 * @function postCreate
 * @summary Routes the get request of /create to create an event using the request
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
router.post('/create', (req, res) => {
    actions.createEvent(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to add event to database', err)
    });
});

/**
 * @function postUpdate
 * @summary Routes the get request of /update to update the page
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
router.post('/update', (req, res) => {
    actions.updateEvent(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to update event in database', err)
    });
});

/**
 * @function postCheckIn
 * @summary Routes the get request of /checkin to checkin the Alumnus using their information sent in the request
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
router.post('/checkin', (req, res) => {
    actions.eventCheckIn(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to check into event', err)
    });
});


/**
 * @function postFeedback
 * @summary Routes the get request of /feedback to allow an Alumni to provide feedback
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
router.post('/feedback', (req, res) => {
    actions.eventFeedback(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to provide feedback for event', err)
    });
});

/**
 * @function getInterested
 * @summary Routes the get request of /interested to show the interest in an event
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
router.get('/interested/:eventID', (req, res) => {
    actions.interestedInEvent(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to show interest in event', err)
    });
});

/**
 * @function getAccept
 * @summary Routes the get request of /accept to allow the Alumni Office to approve events
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
router.get('/accept/:eventID', (req, res) => {
    actions.approveEvent(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to approve event', err)
    });
});

/**
 * @function getDeny
 * @summary Routes the get request of /deny to allow the Alumni Office to deny an event
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
router.get('/deny/:eventID', (req, res) => {
    actions.denyEvent(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to deny event', err)
    });
});

/**
 * @function postFilter
 * @summary Routes the get request of /filter to filter an event using the request body. If the body has been flagged with the 
 * report flag, then it will proceed to getReport
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
router.post('/filter', (req, res) => {
    req.app.locals.filters = req.body
    if(req.body.hasOwnProperty('report') && req.body.report == 1) {
        res.redirect('/report');
    }
    else {
        res.redirect('/');
    }
});

/**
 * @function getClear
 * @summary Routes the get request of /clear to clear the filters that have been applied to the events
 * @callback
 * 
 * @param {Object} req - This is the route request
 * @param {Object} res - This is the route response
 * 
 * @returns {} - This function does not return anything
 */
router.get('/clear', (req, res) => {
    req.app.locals.filters = {};
    res.redirect('/');
});

module.exports = router;

