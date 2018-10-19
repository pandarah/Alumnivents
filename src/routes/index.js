const express = require('express');
const moment = require('moment');

const site = require('../SiteConstants');
const GenerateData = require('../api/GenerateData');
const Utils = require('../api/EventUtils');

const router = express.Router();


/* GET home page. */
router.get('/', (req, res) => {
    const events = GenerateData(30);
    if (!req.session.hasOwnProperty('loggedIn')) {
        req.session.loggedIn = false;
    };

    res.render('index', {
        name: site.name,
        loggedIn: req.session.loggedIn,
        events: Utils.splitEvents(events),
        moment,
    });
});

router.get('/login', (req, res) => {
    res.redirect('/');
})

router.post('/login', (req, res) => {
    if(req.session.loggedIn) {
        req.session.loggedIn = false;
        res.redirect('/');
    }
    else if (req.body.password === site.password) {
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

router.get('/print', (req, res) => {

});

router.get('/create', (req, res) => {

});

router.post('/create', (req, res) => {
    
});


module.exports = router;
