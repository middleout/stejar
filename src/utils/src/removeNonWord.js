module.exports = function removeNonWord(str) {
    return str.replace(/[^0-9a-zA-Z\xC0-\xFF -]/g, "");
};
