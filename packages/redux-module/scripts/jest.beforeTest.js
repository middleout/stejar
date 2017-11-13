/**
 * We want to be able to have a generanal
 * before test script. BUT we also want to be able to
 * customize it before running it. This way we keep it
 * the common scripts sectionw hile still allowing for
 * customization
 */
module.exports = require("./../../../scripts/jest.beforeTest")({
    React: require("react")
});
