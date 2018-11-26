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

router.post('/create', (req, res) => {
    console.log(req.body);
    actions.createEvent(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to add event to database', err)
    });
});

router.post('/update', (req, res) => {
    actions.updateEvent(req).then(() => {
        res.redirect('/');
    }).catch(err => {
        res.send(err);
        console.warn('Unable to update event in database', err)
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
    if(req.body.hasOwnProperty('report')) {
        res.redirect('/report');
    }
    else {
        res.redirect('/');
    }
});

router.get('/clear', (req, res) => {
    req.app.locals.filters = {};
    res.redirect('/');
});

module.exports = router;

