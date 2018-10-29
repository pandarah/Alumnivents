const normalize = require('./Normalize');
const utils = require('./Utils');

/**
 * @function createAsyncDB
 * @see https://gist.github.com/yizhang82/26101c92faeea19568e48224b09e2d1c
 */
const createAsyncDB = db => {
    db.getAsync = sql => {
        return new Promise((resolve, reject) => {
            db.get(sql, (err, row) => {
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

const getHost = async (db, eventID) => {
    const hostStmt = `SELECT * FROM hosts WHERE eventID = ${eventID}`;
    return await db.getAsync(hostStmt);
};

const getLocation = async (db, eventID) => {
    const locationStmt = `SELECT * FROM locations WHERE eventID = ${eventID}`;
    return await db.getAsync(locationStmt);
};

const getAttendees = async (db, eventID) => {
    const attendeeStmt = `SELECT * FROM attendees WHERE eventID = ${eventID}`;
    return await db.allAsync(attendeeStmt);
};

const getComments = async (db, eventID) => {
    const commentStmt = `SELECT * FROM comments WHERE eventID = ${eventID}`;
    return await db.allAsync(commentStmt);
};

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

const createEvent = async (db, event, isLoggedIn) => {
    const eventStmt = 'INSERT INTO events (name, date, endTime, description, category, interested, approved, denied, created) VALUES ($name, $date, $endTime, $description, $category, $interested, $approved, $denied, $created)';
    const hostStmt = 'INSERT INTO hosts (eventID, name, email, major, graduation, created) VALUES ($eventID, $name, $email, $major, $graduation, $created)';
    const locationStmt = 'INSERT INTO locations (eventID, address, city, state, zipcode, country, created) VALUES ($eventID, $address, $city, $state, $zipcode, $country, $created)';

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
};

const eventCheckIn = async (db, attendee) => {
    const stmt = 'INSERT INTO attendees (eventID, name, major, graduation, created) VALUES ($eventID, $name, $major, $graduation, $created)';
    const result = await db.runAsync(stmt, {
        $eventID: attendee.event,
        $name: utils.concatName(attendee.firstname, attendee.lastname),
        $major: attendee.major,
        $graduation: attendee.graduation,
        $created: utils.getCurrentDate(),
    });
    if (!result.hasOwnProperty('lastID')) {
        console.warn(result);
    }
}

const eventFeedback = async (db, feedback) => {
    const stmt = 'INSERT INTO comments (eventID, name, rating, detail, created) VALUES ($eventID, $name, $rating, $detail, $created)';
    const result = await db.runAsync(stmt, {
        $eventID: feedback.event,
        $name: utils.concatName(feedback.firstname, feedback.lastname),
        $rating: feedback.rating,
        $detail: feedback.comment,
        $created: utils.getCurrentDate(),
    });
    if (!result.hasOwnProperty('lastID')) {
        console.warn(result);
    }
}

const interestedInEvent = async (db, eventID) => {
    const stmt = 'UPDATE events SET interested = interested + 1 WHERE id = $id';
    const result = await db.runAsync(stmt, {
        $id: eventID
    });
    if (!result.hasOwnProperty('changes')) {
        console.warn(result);
    }
}

const approveEvent = async (db, eventID) => {
    const stmt = 'UPDATE events SET approved = 1 WHERE id = $id';
    const result = await db.runAsync(stmt, {
        $id: eventID,
    });
    if (!result.hasOwnProperty('changes')) {
        console.warn(result);
    }
};

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
    eventCheckIn,
    eventFeedback,
    interestedInEvent,
    approveEvent,
    denyEvent,
};
