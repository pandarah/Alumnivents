const faker = require('faker');
const moment = require('moment');

const weightedBool = weight => {
    const variable = faker.random.number({ min: 1, max: 100 });
    return variable <= weight ? true : false;
}

module.exports = count => {
    const events = []
    for (let i = 0; i < count; i++) {
        const date = new Date(faker.random.number({ min: 1990, max: 2050 }).toString())
        events.push({
            id: i,
            name: faker.lorem.sentence(),
            host: faker.name.firstName().concat(' ', faker.name.lastName()),
            location: faker.address.streetAddress(),
            date,
            endTime: moment(date).add(faker.random.number({ min: 1, max: 23 }), 'hours'),
            description: faker.lorem.sentences(5),
            category: faker.database.column(),
            attendees: new Array(faker.random.number({ min: 0, max: 50 })).fill(0).map(() => {
                return {
                    name: faker.name.firstName().concat(' ', faker.name.lastName()),
                    major: faker.commerce.department(),
                    gradYear: faker.random.number({ min: 1900, max: moment().subtract(1, 'year').year()})
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
        });
    };
    return events;
};

