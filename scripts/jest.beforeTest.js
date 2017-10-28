module.exports = (globals = {}) => {
    global.window = global;
    Object.keys(globals).forEach(key => {
        global[key] = globals[key];
    });
    window.addEventListener = () => {};
    window.requestAnimationFrame = () => {
        throw new Error("requestAnimationFrame is not supported in Node");
    };
};
