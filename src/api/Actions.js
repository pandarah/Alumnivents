const database = require('./Database');

//Async functions that call the database functions

//Get all of the events and store them into a global variable (for when an update to page is needed)
const refreshEvents = async req => {
    try {
        const data = await database.getEvents(req.app.locals.db)
        req.app.locals.events = data;
    } catch (err) {
        console.warn('Error fetching events from database', err);
    }
};

const createEvent = async req => {
    try {
        await database.createEvent(req.app.locals.db, req.body, req.session.loggedIn)
    } catch (err) {
        console.warn('Error creating event', err);
    }
};

const updateEvent = async req => {
    try {
        await database.updateEvent(req.app.locals.db, req.body)
    } catch (err) {
        console.warn('Error creating event', err);
    }
};

const eventCheckIn = async req => {
    try {
        await database.eventCheckIn(req.app.locals.db, req.body);
    } catch (err) {
        console.warn('Error checking into event', err)
    }
};

const eventFeedback = async req => {
    try {
        await database.eventFeedback(req.app.locals.db, req.body);
    } catch (err) {
        console.warn('Error providing feedback on event', err)
    }
};

const interestedInEvent = async req => {
    try {
        await database.interestedInEvent(req.app.locals.db, req.params.eventID);
    } catch (err) {
        console.warn('Error updating interest count for event', err)
    }
};

const approveEvent = async req => {
    try {
        await database.approveEvent(req.app.locals.db, req.params.eventID);
    } catch (err) {
        console.warn('Error approving event', err)
    }
};

const denyEvent = async req => {
    try {
        await database.denyEvent(req.app.locals.db, req.params.eventID);
    } catch (err) {
        console.warn('Error denying event', err)
    }
};

module.exports = {
    refreshEvents,
    createEvent,
    updateEvent,
    eventCheckIn,
    eventFeedback,
    interestedInEvent,
    approveEvent,
    denyEvent,
}