const normalize = require('./Normalize');
const utils = require('./Utils');

/**
 * @function createAsyncDB
 * @summary 
 * @see https://gist.github.com/yizhang82/26101c92faeea19568e48224b09e2d1c
 * 
 * @param {sqlite3.db} db - the database to run requests on
 * 
 * @returns {Promise} the result of the db query
 */

const createAsyncDB = db => {
    db.getAsync = sql => {
        return new Promise((resolve, reject) => {
            db.get(sql, (err, row) => {
                err ? reject(err) : resolve(row);
            });
        });
    };
    
    db.getAsync = (sql,params) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                err ? reject(err) : resolve(row);
            });
        });
    };

    db.runAsync = (sql, params) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                err ? reject(err) : resolve(this);
            });
        });
    };

    db.allAsync = sql => {
        return new Promise((resolve, reject) => {
            db.all(sql, (err, rows) => {
                err ? reject(err) : resolve(rows);
            });
        });
    };
}

 /**
  * @async
  * @function getHost
  * @summary Retrieves the host of an event given the event ID
  * 
  * @param {sqlite3.db} db - The database which holds all event information
  * @param {Number} eventID - The ID of an event
  * 
  * @return {Object} - The result of the query is an object containing host information
  */
const getHost = async (db, eventID) => {
    const hostStmt = `SELECT * FROM hosts WHERE eventID = ${eventID}`;
    return await db.getAsync(hostStmt);
};

 /**
  * @async
  * @function getLocation
  * @summary Retrieves the location of an event given the event ID
  * 
  * @param {sqlite3.db} db - The database which holds all event information
  * @param {Number} eventID - The ID of an event
  * 
  * @return {Object} - The result of the is the location information of an event
  */
const getLocation = async (db, eventID) => {
    const locationStmt = `SELECT * FROM locations WHERE eventID = ${eventID}`;
    return await db.getAsync(locationStmt);
};

 /**
  * @async
  * @function getAttendees
  * @summary Retrieves all the attendees of an event given the event ID
  * 
  * @param {sqlite3.db} db - The database which holds all event information
  * @param {Number} eventID - The ID of an event
  * 
  * @return {Object} - The result is an object containing all attendees of the event
  */
const getAttendees = async (db, eventID) => {
    const attendeeStmt = `SELECT * FROM attendees WHERE eventID = ${eventID}`;
    return await db.allAsync(attendeeStmt);
};

 /**
  * @async
  * @function getComments
  * @summary Retrieves all comments/feedback of an event given the event ID
  * 
  * @param {sqlite3.db} db - The database which holds all event information
  * @param {Number} eventID - The ID of an event
  * 
  * @return {Object} - The result of is an object containing all comments on the event
  */
const getComments = async (db, eventID) => {
    const commentStmt = `SELECT * FROM comments WHERE eventID = ${eventID}`;
    return await db.allAsync(commentStmt);
};

 /**
  * @async
  * @function getEvents
  * @summary Retrieves the events from the database
  * 
  * @param {sqlite3.db} db - The database which holds all event information
  * 
  * @return {Object} - The result of the query is an object containing all events
  */
const getEvents = async db => {
    const eventStmt = 'SELECT * FROM events';
    const rows = await db.allAsync(eventStmt);
    if (rows.length) {
        return await Promise.all(rows.map(async row => {
            const eventID = row.id;
            const event = normalize.event(row);
            event.attendees = [];
            event.comments = [];

            const host = await getHost(db, eventID);
            event.host = host ? host : {
                name: 'Alumni Office',
                email: 'alumni@scu.edu',
                major: 'N/A',
                graduation: 'N/A',
            };

            const location = await getLocation(db, eventID);
            event.location = location ? location : 'Error';

            const attendees = await getAttendees(db, eventID);
            if (attendees.length) {
                event.attendees = attendees.map(attendee => {
                    return normalize.attendee(attendee);
                });
            }

            const comments = await getComments(db, eventID);
            if (comments.length) {
                event.comments = comments.map(comment => {
                    return normalize.comment(comment);
                });
            }
            return event;
        }));
    } else {
        console.log('empty')
        return [];
    }
};

 /**
  * @async
  * @function createEvent
  * @summary Adds provided event information to the database if the host is verified as an alumnus
  * 
  * @param {sqlite3.db} db - The database which holds all event information
  * @param {Object} event- The information of the event to be created held in an object
  * @param {boolean} isLoggedIn - Whether it is the office creating the event or not
  * 
  * @return {} - This function does not have a return value
  */
const createEvent = async (db, event, isLoggedIn) => {
    
    const eventStmt = 'INSERT INTO events (name, date, endTime, description, category, interested, approved, denied, created) VALUES ($name, $date, $endTime, $description, $category, $interested, $approved, $denied, $created)';
    const hostStmt = 'INSERT INTO hosts (eventID, name, email, major, graduation, created) VALUES ($eventID, $name, $email, $major, $graduation, $created)';
    const locationStmt = 'INSERT INTO locations (eventID, address, city, state, zipcode, country, created) VALUES ($eventID, $address, $city, $state, $zipcode, $country, $created)';
    const alumStmt = `SELECT * FROM alumni WHERE name = $name AND major = $major AND graduation = $graduation`;
    
    var alumResult = true;
    if(!isLoggedIn){
        const hostName = utils.concatName(event.firstname, event.lastname);
        const temp = await db.getAsync(alumStmt,{//checks if submitted host is an alumni through the list
            $name: hostName,
            $major: event.major,
            $graduation:event.graduation,
        });
        alumResult = (temp != undefined);//should be true if the get run got something from the alumni table
        
    }
    
    if(alumResult){
        const result = await db.runAsync(eventStmt, {
            $name: event.name,
            $date: event.date,
            $endTime: event.endTime,
            $description: event.description,
            $category: event.category,
            $interested: 0,
            $approved: isLoggedIn ? 1 : 0,
            $denied: 0,
            $created: utils.getCurrentDate(),
        });
        if (result.hasOwnProperty('lastID')) {
            await db.runAsync(hostStmt, {
                $eventID: result.lastID,
                $name: isLoggedIn ? 'Alumni Office' : utils.concatName(event.firstname, event.lastname),
                $email: isLoggedIn ? 'alumni@scu.edu' : event.email,
                $major: isLoggedIn ? 'N/A' : event.major,
                $graduation: isLoggedIn ? 'N/A' : event.graduation,
                $created: utils.getCurrentDate(),
            });
            await db.runAsync(locationStmt, {
                $eventID: result.lastID,
                $address: utils.concatAddress(event.address1, event.address2),
                $city: event.city,
                $state: event.state,
                $zipcode: event.zipcode,
                $country: event.country,
                $created: utils.getCurrentDate(),
            });
        } else {
            console.warn('Error inserting host and location');
        }
    }
};

/**
  * @async
  * @function updateEvent
  * @summary Updates the information of a particular event that has been edited by the alumni office
  * 
  * @param {sqlite3.db} db - The database which holds all event information
  * @param {Object} event- The information of the event to be created held in an object
  * 
  * @return {} - This function does not have a return value
  */
const updateEvent = async (db, event) => {
    const stmt = 'UPDATE events SET name = $name, date = $date, endTime = $endTime, description = $description, category = $category WHERE id = $id';
    const result = await db.runAsync(stmt, {
        $id: event.id,
        $name: event.name,
        $date: event.date,
        $endTime: event.endTime,
        $description: event.description,
        $category: event.category,
    });
    if (!result.hasOwnProperty('changes')) {
        console.warn(result);
    } else {
        const locationStmt = 'UPDATE locations SET address = $address, city = $city, state = $state, zipcode = $zipcode, country = $country WHERE id = $id';
        const locationResult = await db.runAsync(locationStmt, {
            $id: event.id,
            $address: utils.concatAddress(event.address1, event.address2),
            $city: event.city,
            $state: event.state,
            $zipcode: event.zipcode,
            $country: event.country,
        });
        if (!locationResult.hasOwnProperty('changes')) {
            console.warn(locationResult);
        }
        if (event.hasOwnProperty('firstname')) {
            const hostStmt = 'UPDATE hosts SET name = $name, email = $email, major = $major, graduation = $graduation WHERE id = $id';
            const hostResult = await db.runAsync(hostStmt, {
                $id: event.id,
                $name: utils.concatName(event.firstname, event.lastname),
                $email: event.email,
                $major: event.major,
                $graduation: event.graduation,
            });
            if (!hostResult.hasOwnProperty('changes')) {
                console.warn(hostResult);
            }
        }
    }
}

/**
  * @async
  * @function eventCheckIn
  * @summary Adds person checking in as an attendee of an event if they are verified as an alumnus
  * 
  * @param {sqlite3.db} db - The database which holds all event information
  * @param {Object} attendee- The information of the alumni to be added as an attendee whose held in an object
  * 
  * @return {} - This function does not have a return value
  */
const eventCheckIn = async (db, attendee) => {
    const attendName = utils.concatName(attendee.firstname, attendee.lastname);
    const stmt = 'INSERT INTO attendees (eventID, name, major, graduation, created) VALUES ($eventID, $name, $major, $graduation, $created)';
    const alumStmt = `SELECT * FROM alumni WHERE name = $name AND major = $major AND graduation = $graduation`;
    
    
    const temp = await db.getAsync(alumStmt,{//checks if attendee is an alumni through the alumni list
        $name: attendName,
        $major: attendee.major,
        $graduation:attendee.graduation,
    });
    const alumResult = (temp != undefined);//should be true if the get run got something from the alumni table
    
    if(alumResult){//only run if the person attempting to check in is an alumni
        const result = await db.runAsync(stmt, {
            $eventID: attendee.event,
            $name: attendName,
            $major: attendee.major,
            $graduation: attendee.graduation,
            $created: utils.getCurrentDate(),
        });
        if (!result.hasOwnProperty('lastID')) {
            console.warn(result);
        }
    }
}

/**
  * @async
  * @function eventFeedback
  * @summary Adds feedback to the database for a specific event if the person providing feedback is already checked in to the event
  * 
  * @param {sqlite3.db} db - The database which holds all event information
  * @param {Object} feedback- The information of the feedback to be added held in an object
  * 
  * @return {} - This function does not have a return value
  */
const eventFeedback = async (db, feedback) => {
    const fbName = utils.concatName(feedback.firstname, feedback.lastname);
    const stmt = 'INSERT INTO comments (eventID, name, rating, detail, created) VALUES ($eventID, $name, $rating, $detail, $created)';
    const chkStmt = 'SELECT * FROM attendees WHERE name = $name'
    
    const temp = await db.getAsync(chkStmt,{
        $name: fbName,
    });
    const fbResult = (temp != undefined);
    if(fbResult){
        const result = await db.runAsync(stmt, {
            $eventID: feedback.event,
            $name: fbName,
            $rating: feedback.rating,
            $detail: feedback.comment,
            $created: utils.getCurrentDate(),
        });
        if (!result.hasOwnProperty('lastID')) {
            console.warn(result);
        }
    }
}

/**
  * @async
  * @function interestedInEvent
  * @summary Increases the interested count for an event by 1 if the interested button is clicked
  * 
  * @param {sqlite3.db} db - The database which holds all event information
  * @param {Number} eventID - The ID of an event
  * 
  * @return {} - This function does not have a return value
  */
const interestedInEvent = async (db, eventID) => {
    const stmt = 'UPDATE events SET interested = interested + 1 WHERE id = $id';
    const result = await db.runAsync(stmt, {
        $id: eventID
    });
    if (!result.hasOwnProperty('changes')) {
        console.warn(result);
    }
}

/**
  * @async
  * @function approveEvent
  * @summary Alumni office approves event, changing it to approved in the database so that it is no longer pending
  * 
  * @param {sqlite3.db} db - The database which holds all event information
  * @param {Number} eventID - The ID of an event
  * 
  * @return {} - This function does not have a return value
  */
const approveEvent = async (db, eventID) => {
    const stmt = 'UPDATE events SET approved = 1 WHERE id = $id';
    const result = await db.runAsync(stmt, {
        $id: eventID,
    });
    if (!result.hasOwnProperty('changes')) {
        console.warn(result);
    }
};

/**
  * @async
  * @function denyEvent
  * @summary Alumni office denies event, changing it to denied in the database so that it no longer shows up
  * 
  * @param {sqlite3.db} db - The database which holds all event information
  * @param {Number} eventID - The ID of an event
  * 
  * @return {} - This function does not have a return value
  */
const denyEvent = async (db, eventID) => {
    const stmt = 'UPDATE events SET denied = 1 WHERE id = $id';
    const result = await db.runAsync(stmt, {
        $id: eventID,
    });
    if (!result.hasOwnProperty('changes')) {
        console.warn(result);
    }
};

module.exports = {
    createAsyncDB,
    getHost,
    getLocation,
    getAttendees,
    getComments,
    getEvents,
    createEvent,
    updateEvent,
    eventCheckIn,
    eventFeedback,
    interestedInEvent,
    approveEvent,
    denyEvent,
};
