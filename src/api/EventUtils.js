const splitEvents = data => {
    const date = new Date();
    const upcoming = [], past = [], pending = [];
    data.forEach(event => {
        if (!event.approved) {
            pending.push(event);
        }
        else if (event.date > date) {
            upcoming.push(event);
        } else {
            past.push(event);
        }
    });
    return {
        pending,
        upcoming,
        past,
    };
};

module.exports = {
    splitEvents,
};
