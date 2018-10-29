//converting the data that is retrieved from the database into the correct format for processing/ui. Stripping unnecessary data

const host = data => {
    return {
        name: data.name,
        email: data.email,
        major: data.major,
        graduation: data.graduation
    }
};

const attendee = data => {
    return {
        name: data.name,
        major: data.major,
        graduation: data.graduation
    };
};

const location = data => {
    return {
        address: data.address,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode,
        country: data.country,
    };
};
const comment = data => {
    return {
        name: data.name,
        rating: data.rating,
        detail: data.detail
    }
};

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
