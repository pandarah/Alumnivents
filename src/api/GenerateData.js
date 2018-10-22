const faker = require('faker');
const moment = require('moment');

const categories = require('./constants/Categories');
const majors = require('./constants/MajorTypes');

const weightedBool = weight => {
    const variable = faker.random.number({ min: 1, max: 100 });
    return variable <= weight ? true : false;
}

const allMajors = () => {
    const result = [];
    Object.values(majors).forEach(school => {
        Object.values(school.list).forEach(major => result.push(major))
    });
    return result;
}

const majorList = allMajors();

module.exports = count => {
    const events = []
    for (let i = 0; i < count; i++) {
        const date = new Date(faker.random.number({ min: 1990, max: 2050 }).toString())
        events.push({
            id: i,
            name: faker.lorem.sentence(),
            host: {
                name: faker.name.firstName().concat(' ', faker.name.lastName()),
                email: faker.internet.email(),
                major: majorList[faker.random.number({ min: 0, max: majorList.length - 1 })],
                graduation: faker.random.number({ min: 1900, max: moment().subtract(1, 'year').year() }),
            },
            location: {
                address: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.stateAbbr(),
                zipcode: faker.address.zipCode('#####'),
                country: faker.address.country(),
            },
            date,
            endTime: moment(date).add(faker.random.number({ min: 1, max: 23 }), 'hours'),
            description: faker.lorem.sentences(5),
            category: categories[faker.random.number({ min: 0, max: categories.length - 1 })],
            interested: faker.random.number({ min: 0, max: 100 }),
            attendees: new Array(faker.random.number({ min: 0, max: 50 })).fill(0).map(() => {
                return {
                    name: faker.name.firstName().concat(' ', faker.name.lastName()),
                    major: majorList[faker.random.number({ min: 0, max: majorList.length - 1 })],
                    graduation: faker.random.number({ min: 1900, max: moment().subtract(1, 'year').year()})
                }
            }),
            comments: new Array(faker.random.number({ min: 0, max: 30 })).fill(0).map(() => {
                return {
                    name: faker.name.firstName().concat(' ', faker.name.lastName()),
                    rating: faker.random.number({ min: 1, max: 5}),
                    detail: faker.lorem.sentences(3),
                }
            }),
            approved: weightedBool(85),
            denied: weightedBool(5),
        });
    };
    return events;
};
