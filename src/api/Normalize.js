const host = data => {
    return data.map(host => {
        return {
            name: host.name,
            email: host.email,
            major: host.hostMajor,
            graduation: host.graduation
        }
    });
};

const attendee = data => {
    return data.map(attendee => {
        return {
            name: attendee.name,
            major: attendee.major,
            graduation: attendee.graduation
        };
    });
};

const location = data => {
    return data.map(location => {
        return {
            address: location.address,
            city: location.city,
            state: location.state,
            zipcode: location.zipcode,
            country: location.country,
        };
    });
};
const comment = data => {
    return data.map(comment => {
        return {
            name: comment.name,
            rating: comment.feedback,
            detail: comment.detail
        }
    });
};

const event = data => {
    return data.map(event => {
        return {
            eventID: event.id,
            name: event.name,
            date: event.date,
            endTime: event.endTime,
            description: event.description,
            category: event.category,
            interested: event.interested,
            attendees: event.attendees,
            approved: event.approved,
            denied: event.denied
        }
    });
}

module.exports = {
    host,
    location,
    attendee,
    comment,
    event,
};
