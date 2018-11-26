/**
 * @file
 * @summary The goal of this file is to provide helpful functions to simplify things.
 */

/**
 * @function getCurrentDate
 * @summary Retrieves the current date
 * 
 * @param {}  - This function has no parameters
 * 
 * @returns {} - This function does not return anything
 */
const getCurrentDate = () => Math.round(new Date().getTime() / 1000);

/**
 * @function concatName
 * @summary Concatenates an Alumni's name so that it can be combined from the database
 * 
 * @param {String} first  - This first name of the individual
 * @param {String} last - The last name of the individual
 * 
 * @returns {String} - This function returns the concatenated string of first and last name
 */
const concatName = (first, last) => first.concat(' ', last);

/**
 * @function splitNames
 * @summary Concatenates an Alumni's name so that it can be combined from the database
 * 
 * @param {String} first  - The first name of the individual
 * @param {String} last - The last name of the individual
 * 
 * @returns {Object} - This function retuns an object containing the first and last name split as strings.
 */
const splitNames = name => {
    const names = name.split(' ');
    return {
        first: names[0],
        last: names[1],
    };
};

/**
 * @function concatAddress
 * @summary Concatenates an address for the full location
 * 
 * @param {String} address  - This street address
 * @param {String} address2 - The apartment number
 * 
 * @returns {String} - This function returns the entire address combined
 */
const concatAddress = (address, address2) => address2.length ? address.concat(', ', address2) : address;

/**
 * @function splitAddress
 * @summary Splits the address into 2 parts (street address and apartment/unit number) if needed for editing purposes
 * 
 * @param {String} address  - The full address
 * 
 * @returns {Object} - This function returns the 2 parts of the address seperately within an object
 */
const splitAddress = address => {
    const parts = address.split(', ');
    return {
        address: parts[0],
        address2: parts[1] ? parts[1] : '',
    };
};

module.exports = {
    getCurrentDate,
    concatName,
    splitNames,
    concatAddress,
    splitAddress,
};
