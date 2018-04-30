import { createElement, Component } from "react";

export function createLoader(debug = false) {
    let usedChunks = [];
    let resolvedKeys = [];
    let resolvedData = [];
    let loaders = [];
    let chunksIds = [];

    function resolve(loader, result) {
        if (Object.keys(result).length === 1) {
            result = result[Object.keys(result)[0]];
        }

        resolvedKeys.push(loader);
        resolvedData.push(result);

        return result;
    }

    const getUsedChunks = () => usedChunks;

    const start = paths => {
        let promises = [];
        paths.map(chunkId => {
            promises.push(
                loaders[chunksIds.indexOf(chunkId)]().then(result => {
                    resolve(loaders[chunksIds.indexOf(chunkId)], result);
                })
            );
        });

        return Promise.all(promises);
    };

    const preloadAll = () => {
        return Promise.all(loaders.map(loader => loader())).then(results => {
            results.forEach((result, key) => resolve(loaders[key], result));
        });
    };

    const create = (chunkId, loader) => {
        loaders.push(loader);
        chunksIds.push(chunkId);

        function load() {
            return loader().then(component => {
                component = resolve(loader, component);
                usedChunks.push(chunksIds[loaders.indexOf(loader)]);

                return component;
            });
        }

        return {
            load,
            component: class LoadComp extends Component {
                state = {
                    component: null,
                };

                constructor(props) {
                    super(props);

                    if (resolvedKeys.includes(loader)) {
                        usedChunks.push(chunksIds[loaders.indexOf(loader)]);
                        this.state.component = resolvedData[resolvedKeys.indexOf(loader)];
                        if (debug) {
                            console.info("Contains cache for resolved data" + chunkId);
                        }
                    } else {
                        if (debug) {
                            console.info("Does not contain resolved data for " + chunkId);
                        }
                    }
                }

                render() {
                    return this.state.component ? createElement(this.state.component, this.props) : null;
                }

                componentDidMount() {
                    if (this.state.component) {
                        return;
                    }

                    load().then(component => this.setState({ component }));
                }
            },
        };
    };

    return {
        getUsedChunks,
        start,
        preloadAll,
        create,
    };
}
