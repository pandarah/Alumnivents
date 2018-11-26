/**
 * @file 
 * @summary Async functions that call the database functions
 */
const database = require('./Database');

/**
 * @function refreshEvents
 * @summary This function gets all of the events and stores them into a global variable (for when an update to page is needed)
 * 
 * @param {Object} req - The function recieves a request
 * 
 * @returns {} - This function does not return anything
 */
const refreshEvents = async req => {
    try {
        const data = await database.getEvents(req.app.locals.db)
        req.app.locals.events = data;
    } catch (err) {
        console.warn('Error fetching events from database', err);
    }
};

/**
 * @function createEvent
 * @summary This function calls the async function to create an event using the request information
 * 
 * @param {Object} req - The function recieves a request
 * 
 * @returns {} - This function does not return anything
 */
const createEvent = async req => {
    try {
        await database.createEvent(req.app.locals.db, req.body, req.session.loggedIn)
    } catch (err) {
        console.warn('Error creating event', err);
    }
};

/**
 * @function updateEvent
 * @summary This function calls the async function to update an event using the request information
 * 
 * @param {Object} req - The function recieves a request
 * 
 * @returns {} - This function does not return anything
 */
const updateEvent = async req => {
    try {
        await database.updateEvent(req.app.locals.db, req.body)
    } catch (err) {
        console.warn('Error creating event', err);
    }
};

/**
 * @function eventCheckIn
 * @summary This function calls the async function to check in to an event using the request information
 * 
 * @param {Object} req - The function recieves a request
 * 
 * @returns {} - This function does not return anything
 */
const eventCheckIn = async req => {
    try {
        await database.eventCheckIn(req.app.locals.db, req.body);
    } catch (err) {
        console.warn('Error checking into event', err)
    }
};

/**
 * @function eventFeedback
 * @summary This function calls the async function to add feedback to an event using the information in the request
 * 
 * @param {Object} req - The function recieves a request
 * 
 * @returns {} - This function does not return anything
 */
const eventFeedback = async req => {
    try {
        await database.eventFeedback(req.app.locals.db, req.body);
    } catch (err) {
        console.warn('Error providing feedback on event', err)
    }
};

/**
 * @function interestedInEvent
 * @summary This function calls the async function to increment the interested count of an event
 * 
 * @param {Object} req - The function recieves a request
 * 
 * @returns {} - This function does not return anything
 */
const interestedInEvent = async req => {
    try {
        await database.interestedInEvent(req.app.locals.db, req.params.eventID);
    } catch (err) {
        console.warn('Error updating interest count for event', err)
    }
};

/**
 * @function approveEvent
 * @summary This function calls the async function to approve an event
 * 
 * @param {Object} req - The function recieves a request
 * 
 * @returns {} - This function does not return anything
 */
const approveEvent = async req => {
    try {
        await database.approveEvent(req.app.locals.db, req.params.eventID);
    } catch (err) {
        console.warn('Error approving event', err)
    }
};

/**
 * @function denyEvent
 * @summary This function calls the async function to deny an event
 * 
 * @param {Object} req - The function recieves a request
 * 
 * @returns {} - This function does not return anything
 */
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