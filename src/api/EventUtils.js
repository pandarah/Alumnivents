const _ = require('lodash');
const utils = require('./Utils')

//Manipulating event objects (filtering, getting locations for dropdown, etc.)

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

const compileLocations = events => {

    const locations = new Set();
    events.forEach(event => {
        locations.add(event.location.city);
    });
    return Array.from(locations);
	
};

const filterBySearch = (search, events) => {
    if (search === '') {
        return events;
    }
    const re = new RegExp(_.escapeRegExp(search), 'i')
    const isMatch = result => re.test(result.name)
    return _.filter(events, isMatch);
}

const filterByKey = (filter, events, key) => {
	if(filter == '') {
		return events
	}
	else {
		return events.filter(event => event[key] === filter);
	}
}

const filterByLocation = (filter, events, key) => {
	if(filter == 'null') {
		return events
	}
	else {
		return events.filter(event => event.location[key] === filter);
	}
}

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
