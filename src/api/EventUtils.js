/**
 * @file
 * @summary The general purpose of this file is to introduce functions to use to 
 * manupulate event objects (filtering, getting locations for dropdown, etc.)
 */
const _ = require('lodash');
const utils = require('./Utils')

 /**
 * @function splitEvents
 * @summary Splits the events retrieved into categories of upcoming, past, and pending depending on event approval status and date
 * 
 * @param {Object} events  - The data retrieved from the database in JSON format
 * 
 * @returns {Object} - This function returns the events categorized into 3 categories: pending, upcoming, and past
 */
const splitEvents = events => {
    const date = utils.getCurrentDate();
    const upcoming = [], past = [], pending = [];
    Object.values(events).forEach(event => {
        if (!event.denied) {
            if (!event.approved) {
                pending.push(event);
            }
            else if (event.date > date) {
                upcoming.push(event);
            } else {
                past.push(event);
            }
        }
    });
    return {
        pending,
        upcoming,
        past,
    };
};

 /**
 * @function compileLocations
 * @summary Compiles the locations from each event so that it can be used in the dropdown for filtering
 * 
 * @param {Object} events  - The data retrieved from the database in JSON format
 * 
 * @returns {Array} - This function returns an array of the locations used for the events
 */
const compileLocations = events => {

    const locations = new Set();
    events.forEach(event => {
        locations.add(event.location.city);
    });
    return Array.from(locations);
	
};

 /**
 * @function filterBySearch
 * @summary This function allows the user to search for a specific event by name
 * 
 * @param {Object} events  - The data retrieved from the database in JSON format
 * @param {String} search - The user's query
 * 
 * @returns {Object} - This function returns the events that match the user's query
 */
const filterBySearch = (search, events) => {
    if (search === '') {
        return events;
    }
    const re = new RegExp(_.escapeRegExp(search), 'i')
    const isMatch = result => re.test(result.name)
    return _.filter(events, isMatch);
}

/**
 * @function filterByKey
 * @summary This function allows the user to search for events based on filter
 * 
 * @param {Object} events  - The data retrieved from the database in JSON format
 * @param {String} filter - The user's query of category
 * @param {Int} key - A specified category
 * 
 * @returns {Object} - This function returns the events that match the user's query and the key
 */
const filterByKey = (filter, events, key) => {
	if(filter == '') {
		return events
	}
	else {
		return events.filter(event => event[key] === filter);
	}
}


/**
 * @function filterByLocation
 * @summary This function allows the user to filter based on a specific location
 * 
 * @param {Object} events  - The data retrieved from the database in JSON format
 * @param {String} filter - The user's query of location
 * @param {Int} key - A specified location
 * 
 * @returns {Object} - This function returns the events that match the user's query
 */
const filterByLocation = (filter, events, key) => {
	if(filter == 'null') {
		return events
	}
	else {
		return events.filter(event => event.location[key] === filter);
	}
}

/**
 * @function applyFilters
 * @summary This function applys the filters that a user has specified
 * 
 * @param {Object} events  - The data retrieved from the database in JSON format
 * @param {String} filters - The user's selected filters
 * 
 * @returns {Object} - This function returns the events that match the user's filters
 */
const applyFilters = (filters, events) => {
    const keys = Object.keys(filters);
    if (keys.includes('search')) {
        return filterBySearch(filters.search.toLowerCase(), events);
    } else if (keys.includes('category') && keys.includes('city')) {
        const category = filterByKey(filters.category, events, 'category');
        const city = filterByLocation(filters.city, events, 'city');
        return _.intersectionBy(category, city, 'id');
    }
    
    return events; 
}

module.exports = {
    splitEvents,
    compileLocations,
    filterBySearch,
    filterByKey,
    filterByLocation,
    applyFilters,
};
