
/**
 * @file Suggested Database Structure
 * @summary I suggest we use 5 seperate tables
 *  - Event Table
 *  - Host Table
 *  - Location Table
 *  - Attendee Table
 *  - Comment/Feeback Table
 * 
 * Essentially we will store all of the events in a single table and the identifier will be the ID
 * The hosts will have its own table and have a reference ID to the event ID
 * The locations will have its own table and have a reference ID to the event ID
 * The attendees will have its own table and have a reference ID to the event ID
 * The comments will have its own table and have a reference ID to the event ID
 * 
 * When accessing a single event, in order to get the attendees and comments, we should run JOIN sql commands
 * to search for the attendees/comments for a specific event. This is because you can't store arrays in a MySQL database.
 * 
 * For each event ID, we will search for the specified host, location, attendees and comments.
 * 
 * The required columns with column types can be found below.
 * 
 */
const event = {
    id: 0, // Number (auto incremented)
    name: 'Grand Reunion', // String
    date: 1539954540, // Epoch Time Stamp
    endTime: 1539954541, // Epoch Time Stamp
    description: 'lorem ipsum', // String,
    category: 'Sports', // String
    interested: 10, // Number (count of how many ppl are interested)
    approved: true, // Boolean
    denied: false, // Boolean
    created: 1539954540, // Epoch Time Stamp
};

const host = {
    id: 0, // Number (auto incremented)
    eventID: 0, // Number (associated event)
    name: 'Grant Smith', // String
    email: 'gsmith@scu.edu', // String
    major: 'Child Studies', // String
    graduation: 2000, // Number
    created: 1539954540, // Epoch Time Stamp
};

const location = {
    id: 0, // Number (auto incremented)
    eventID: 0, // Number
    address: '500 El Camino Real', // String
    city: 'Santa Clara', // String
    state: 'California', // String
    zipcode: 95053, // Number
    country: 'United States', // String
    created: 1539954540, // Epoch Time Stamp

};

const attendee = {
    id: 0, // Number (auto incremented)
    eventID: 0, // Number
    name: 'Grant Smith', // String
    major: 'Child Studies', // String
    graduation: 2000, // Number
    created: 1539954540, // Epoch Time Stamp
};

const comment = {
    id: 0, // Number (auto incremented)
    eventID: 0, // Number
    name: 'Grant Smith', //String
    rating: 4, // Number (out of 5)
    detail: 'lorem ipsum', //String
    created: 1539954540, // Epoch time stamp
};

module.exports = {
    event,
    host,
    location,
    attendee,
    comment,
};
