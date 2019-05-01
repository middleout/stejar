const removeNonWord = require("./removeNonWord");

const upperCase = str => str.toUpperCase();
const lowerCase = str => str.toLowerCase();

module.exports = function camelCase(str) {
    str = removeNonWord(str)
        .replace(/-/g, " ") //convert all hyphens to spaces
        .replace(/\s[a-z]/g, upperCase) //convert first char of each word to UPPERCASE
        .replace(/\s+/g, "") //remove spaces
        .replace(/^[A-Z]/g, lowerCase); //convert first char to lowercase
    return str;
};
