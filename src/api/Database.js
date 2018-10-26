const oracledb = require('oracledb');
const config = {
    user: 'tshih',                // Update me
    password: 'alumnivents',        // Update me
    connectString: '//dbserver.engr.scu.edu/db11g'   // Update me
};

/**
 * @function exampleDatabaseFetch
 * @see https://expressjs.com/en/guide/database-integration.html#oracle
 */
const getEvents = async () => {
    let connection;
    try {
        connection = await oracledb.getConnection(config);
        
        const result = await connection.execute(
            'select * from events'
        );

        result.rows.forEach(event => {
            console.log(event.name);
        });

    } catch (err) {
        console.log('Error: ', err);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = {
	oracledb,
	config,
    getEvents,
};
