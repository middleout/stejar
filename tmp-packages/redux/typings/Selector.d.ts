export declare class Selector {
    /**
     * @param {<T, S, P>(state: S, props?: P) => T} selector
     * @param left
     * @param right
     * @returns {(state: any, props?: any) => (any | any | {})}
     */
    static if(selector: <T, S, P>(state: S, props?: P) => T, left: any, right?: any): (state: any, props?: any) => any;
    /**
     * @param args
     * @returns {(state:any, props?:any)=>{}}
     */
    static fromState(...args: any[]): (state: any, props?: any) => {};
}
