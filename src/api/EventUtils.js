const _ = require('lodash');
const utils = require('./Utils')

//Manipulating event objects (filtering, getting locations for dropdown, etc.)

const splitEvents = data => {
    const date = utils.getCurrentDate();
    const upcoming = [], past = [], pending = [];
    data.forEach(event => {
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
    const temp = new Map();
    const locations = [];
    events.forEach((event, idx) => {
        temp.set(idx, event.location.city);
    });
    temp.forEach((location, idx) => locations.push(location));
    return locations;
};

const filterBySearch = (search, events) => {
    if (search === '') {
        return events;
    }
    const re = new RegExp(_.escapeRegExp(search), 'i')
    const isMatch = result => re.test(result.name)
    return _.filter(events, isMatch);
}

const filterByKey = (filter, events, key) => events.filter(event => event[key] === filter);
const filterByLocation = (filter, events, key) => events.filter(event => event.location[key] === filter);

const applyFilters = (filters, events) => {
    const keys = Object.keys(filters);
    if (keys.includes('search')) {
        return filterBySearch(filters.search.toLowerCase(), events);
    } else if (keys.includes('category') && keys.includes('city')) {
        const category = filterByKey(filters.category, events, 'category');
        const city = filterByLocation(filters.city, events, 'city');
        return _.unionBy(category, city, 'id')
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
