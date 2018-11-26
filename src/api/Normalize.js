/**
 * @file
 * @summary The general pupose of this file is converting the data that is retrieved from the 
 * database into the correct format for processing/UI purposes. It is stripping unnecessary data.
 */


 /**
 * @function host
 * @summary Normalizes the host information retrieved from the database
 * 
 * @param {Object} data  - The data retrieved from the database in JSON format
 * 
 * @returns {Object} - This function returns the host information in a normalized form
 */
const host = data => {
    return {
        name: data.name,
        email: data.email,
        major: data.major,
        graduation: data.graduation
    }
};

 /**
 * @function attendee
 * @summary Normalizes the attendee information retrieved from the database
 * 
 * @param {Object} data  - The data retrieved from the database in JSON format
 * 
 * @returns {Object} - This function returns the address information in a normalized form
 */
const attendee = data => {
    return {
        name: data.name,
        major: data.major,
        graduation: data.graduation
    };
};

 /**
 * @function location
 * @summary Normalizes the location information retrieved from the database
 * 
 * @param {Object} data  - The data retrieved from the database in JSON format
 * 
 * @returns {Object} - This function returns the location information in a normalized form
 */
const location = data => {
    return {
        address: data.address,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode,
        country: data.country,
    };
};

 /**
 * @function comment
 * @summary Normalizes the comment information retrieved from the database
 * 
 * @param {Object} data  - The data retrieved from the database in JSON format
 * 
 * @returns {Object} - This function returns the comment information in a normalized form
 */
const comment = data => {
    return {
        name: data.name,
        rating: data.rating,
        detail: data.detail
    }
};

 /**
 * @function event
 * @summary Normalizes the event information retrieved from the database
 * 
 * @param {Object} data  - The data retrieved from the database in JSON format
 * 
 * @returns {Object} - This function returns the event information in a normalized form
 */
const event = data => {
    return {
        id: data.id,
        name: data.name,
        date: data.date,
        endTime: data.endTime,
        description: data.description,
        category: data.category,
        interested: data.interested,
        approved: data.approved ? true : false,
        denied: data.denied ? true : false,
    }
}

module.exports = {
    host,
    location,
    attendee,
    comment,
    event,
};
