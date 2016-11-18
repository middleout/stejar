const pe = require('@hughfdjackson/promise-extras');
import { injectable } from "@stejar/di";

export enum PromiseStatus {
	RESOLVED = "resolved" as any,
	REJECTED = "rejected" as any,
}

export interface PromiseResult<T> {
	error: any;
	status: PromiseStatus;
	value: T;
}

@injectable
export class PromiseService {

	/**
	 * @param data
	 * @returns {Promise<any>}
	 */
	allSettled( ...data: Promise<any>[] ): Promise<PromiseResult<any>[]> {
		return pe.array.allSettled(data);
	}

	/**
	 * @param promises
	 * @returns {function(...[any]): any}
	 */
	chain( promises: Function[] ): ( ...args: any[] ) => Promise<any> {
		return ( ...args: any[] ) => {
			if ( promises.length === 0 ) {
				return Promise.resolve(args.length > 0 ? args[ 0 ] : null);
			}

			var promise = promises[ 0 ](...args);
			for ( var i = 1; i < promises.length; i++ ) {
				promise = promise.then(promises[ i ]);
			}

			return promise;
		};
	}

	/**
	 * @param data
	 * @returns {Promise<T>}
	 */
	hashAll<T>( entry: {[key: string]: Promise<T>} ): {[key: string]: Promise<T>} {
		return pe.array.objectAll(entry);
	}

	/**
	 * @param data
	 * @returns {Promise<T>}
	 */
	hashSettled<T>( entry: {[key: string]: Promise<any>} ): Promise<T> {
		const list = Object.keys(entry).map(entryName => entry[ entryName ]);
		return this.allSettled(...list).then(results => results.reduce(( map, result, index ) => map[ Object.keys(entry)[ index ] ] = result, {}));
	}

	/**
	 * @param timeout
	 * @returns {Promise<any>}
	 */
	delay( timeout: number ): Promise<any> {
		return pe.delay(timeout);
	}
}
