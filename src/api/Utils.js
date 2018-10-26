const concatName = (first, last) => first.concat(' ', last);
const splitNames = name => {
    const names = name.split(' ');
    return {
        first: names[0],
        last: names[1],
    };
};

const concatAddress = (address, address2) => address.concat(', ', address2);
const splitAddress = address => {
    const parts = address.split(', ');
    return {
        address: parts[0],
        address2: parts[1] ? parts[1] : '',
    };
};

module.exports = {
    concatName,
    splitNames,
    concatAddress,
    splitAddress,
};
