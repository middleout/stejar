export function promisesReduce(promisesFactories) {
    return (...args) => {
        promisesFactories.reduce(
            (promise, func) => promise.then(result => func(...args).then(Array.prototype.concat.bind(result))),
            Promise.resolve([])
        );
    };
}
