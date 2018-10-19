const faker = require('faker');

const weightedBool = weight => {
    const variable = faker.random.number({ min: 1, max: 100 });
    return variable <= weight ? true : false;
}

module.exports = count => {
    const events = []
    for (let i = 0; i < count; i++) {
        events.push({
            id: i,
            name: faker.lorem.sentence(),
            location: faker.address.streetAddress(),
            date: new Date(faker.random.number({ min: 1990, max: 2050 }).toString()),
            duration: faker.random.number({ min: 0.5, max: 24 }),
            allDay: weightedBool(10),
            description: faker.lorem.sentences(3),
            category: new Array(faker.random.number({ min: 1, max: 3 })).fill(0).map(() => faker.database.column()),
            attendees: [],
            approved: weightedBool(85), 
        });
    };
    return events;
};
