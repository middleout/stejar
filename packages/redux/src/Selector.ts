export class Selector {
    /**
     * @param {<T, S, P>(state: S, props?: P) => T} selector
     * @param left
     * @param right
     * @returns {(state: any, props?: any) => (any | any | {})}
     */
    static if(selector: <T, S, P>(state: S, props?: P) => T, left: any, right?: any) {
        return (state: any, props?: any) => {
            if (selector(state, props)) {
                return left ? left(state, props) || {} : {};
            } else if (right) {
                return right(state, props);
            } else {
                return {};
            }
        };
    }

    /**
     * @param args
     * @returns {(state:any, props?:any)=>{}}
     */
    static fromState(...args: any[]) {
        return (state: any, props?: any) => {
            const struct = {};
            args.forEach(arg => {
                if (typeof arg !== "function") {
                    Object.keys(arg).forEach(key => {
                        if (typeof arg[key] === "function") {
                            struct[key] = arg[key](state, props);
                        } else if (Array.isArray(arg[key]) && arg[key].length > 0) {
                            const combiner = (innerState: any, innerProps?: any) => {
                                let result = true;
                                arg[key].forEach((innerArg: any) => {
                                    if (!innerArg(innerState, innerProps)) {
                                        result = false;
                                    }
                                });
                                return result;
                            };
                            Object.assign(struct, {
                                [key]: combiner(state, props),
                            });
                        } else {
                            struct[key] = arg[key];
                        }
                    });
                } else {
                    Object.assign(struct, arg(state, props));
                }
            });

            return struct;
        };
    }
}
