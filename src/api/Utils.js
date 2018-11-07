//Helpful functions to simplify things

const getCurrentDate = () => Math.round(new Date().getTime() / 1000);

const concatName = (first, last) => first.concat(' ', last);
const splitNames = name => {
    const names = name.split(' ');
    return {
        first: names[0],
        last: names[1],
    };
};

const concatAddress = (address, address2) => address2.length ? address.concat(', ', address2) : address;
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
