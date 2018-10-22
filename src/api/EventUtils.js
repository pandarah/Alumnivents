const splitEvents = data => {
    const date = new Date();
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

module.exports = {
    splitEvents,
    compileLocations,
};
