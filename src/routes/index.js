const express = require('express');
const moment = require('moment');

const site = require('../SiteConstants');
const GenerateData = require('../api/GenerateData');
const Utils = require('../api/EventUtils');

const router = express.Router();


/* GET home page. */
router.get('/', (req, res, next) => {
    const events = GenerateData(30);
    res.render('index', {
        name: site.name,
        loggedIn: true,
        events: Utils.splitEvents(events),
        moment,
    });
});

module.exports = router;
