
/**
 * @file Suggested Database Structure
 * @summary I suggest we use 3 seperate tables
 *  - Event Table
 *  - Attendee Table
 *  - Comment Table
 * 
 * Essentially we will store all of the events in a single table and the identifier will be the ID
 * - The list of attendees will be stored as a list of the IDs of attendees
 * - The list of comments will be stored as a list of IDs of comments
 * 
 * When accessing a single event, in order to get the attendees and comments, we should run JOIN sql commands
 * To search for the attendees/comments for a specific event. This is because you can't store arrays in a MySQL database
 * 
 * 
 */
const events = [
    {
        id: 0, // Number (auto incremented)
        name: 'Grand Reunion', // String
        host: 'Grant Smith', // String
        location: 'Locatelli', // String
        date: 1539954540, // Epoch Time Stamp
        endTime: 1539954541, // Epoch Time Stamp
        description: 'lorem ipsum', // String,
        category: 'Sports', // String
        attendees: [
            3,
            7,
        ], // Array of Numbers (attendee IDs)
        comments: [
            0, 
            23,
        ], // Array of Numbers (comment IDs)
        approved: true, // Boolean
    },
];

const attendees = [
    {
        id: 0, // Number (auto incremented)
        name: 'Grant Smith', // String
        major: 'Child Studies', // String
        gradYear: 2000, // Number
        created: 1539954540, // Epoch Time Stamp
    },
];

const comments = [
    {
        id: 0, // Number (auto incremented)
        name: 'Grant Smith', //String
        rating: 4, // Number (out of 5)
        detail: 'lorem ipsum', //String
        created: 1539954540, // Epoch time stamp
    },
]

module.exports = {
    events,
    attendees,
    comments,
};
