import * as store from "store";
import moment, { Moment } from "moment";
import { each } from "lodash";
import { injectable } from "@stejar/di";

@injectable
export class CacheService {

	/**
	 * @param store
	 */
	public constructor( protected storeInstance: StoreJSStatic = store ) {
		if (!this.storeInstance) {
			throw new Error("`store` cannot be found");
		}
	}

	/**
	 * @type {boolean}
	 */
	protected debug: boolean = false;

	/**
	 * @type {boolean}
	 */
	protected enabled: boolean = false;

	/**
	 * @returns {boolean}
	 */
	public canCache(): boolean {
		return this.storeInstance.enabled && this.enabled;
	}

	/**
	 * @param args
	 */
	protected log( ...args: any[] ): void {
		if ( !this.debug ) {
			return;
		}

		args.forEach(arg => console.log(arg));
	}

	/**
	 * @param signature
	 * @returns {any|null}
	 */
	public get<T>( signature: string ): T {
		if ( !this.canCache() ) {
			return;
		}

		this.log('Trying to get item ' + signature);

		var value = this.storeInstance.get(signature);

		if ( !value || this.isExpired(value) ) {
			this.log('No data found or expired for  ' + signature);
			return null;
		}

		this.log('Got data from cache for  ' + signature, JSON.parse(value.value));
		return JSON.parse(value.value);
	}

	/**
	 * @returns {void}
	 */
	public clear(): void {
		this.log('Cache cleared');
		this.storeInstance.clear();
	}

	/**
	 * @returns {boolean}
	 */
	public debugEnabled(): boolean {
		return this.debug;
	}

	/**
	 * @param tag
	 * @returns {Array}
	 */
	public getByTag( tag: string ): any[] {
		this.log('Get item by tag: ' + tag);

		var items: any[] = [];
		each(this.storeInstance.getAll(), ( item: any ) => {
			if ( -1 !== item.tags.includes(tag) ) {
				if ( !this.isExpired(item) ) {
					items.push(JSON.parse(item.value));
				}
			}
		});

		this.log('Got items by tag: ' + tag, items);

		return items;
	}

	/**
	 * @param tag
	 */
	public clearByTag( tag: string ): void {
		this.log('Clear items by tag: ' + tag);
		each(this.storeInstance.getAll(), ( item: any, offset: string ) => {
			if ( -1 !== item.tags.includes(tag) ) {
				this.remove(offset);
			}
		});
		this.log('Cleared items by tag: ' + tag);
	}

	/**
	 * @param signature
	 */
	public remove( signature: string ): void {
		this.log('Removing item ' + signature);
		this.storeInstance.remove(signature);
	}

	/**
	 * @param tags
	 */
	public clearByTags( tags: string[] ): void {
		this.log('Clear items by tags: ' + tags.join(', '));
		each(this.storeInstance.getAll(), ( item: any, offset: string ) => {
			each(tags, ( tag ) => {
				if ( -1 !== item.tags.includes(tag) ) {
					this.remove(offset);
				}
			});
		});
		this.log('Cleared items by tags: ' + tags.join(', '));
	}

	/**
	 * @returns {void}
	 */
	public enableDebug(): void {
		this.debug = true;
		this.log('Cache debug enabled');

		if ( !this.storeInstance.enabled ) {
			this.log('Cache is disabled due to browser');
		} else {
			if ( this.enabled ) {
				this.log('Cache is enabled');
			} else {
				this.log('Cache is disabled due to settings');
			}
		}
	}

	/**
	 * @returns {void}
	 */
	public disable(): void {
		this.enabled = false;
		this.log('Cache is disabled due to settings');
	}

	/**
	 * @returns {boolean}
	 */
	public isEnabled(): boolean {
		return this.enabled;
	}

	/**
	 * @returns {void}
	 */
	public enable(): void {
		this.enabled = true;
		this.log('Cache enabled');
	}

	/**
	 * @param name
	 * @param value
	 * @param expiration
	 * @param forcedExpiration
	 * @param tags
	 */
	public set( name: string, value: Object, expiration?: number, forcedExpiration?: number, tags?: string[] ): void {
		if ( !expiration ) {
			expiration = 0;
		}
		if ( !forcedExpiration ) {
			forcedExpiration = 0;
		}

		if ( !this.canCache() ) {
			return;
		}

		var expirationDate: Moment|number       = expiration ? moment().add(expiration, 'seconds') : 0;
		var forcedExpirationDate: Moment|number = forcedExpiration ? moment().add(forcedExpiration, 'seconds') : 0;

		this.log('Setting item into cache ' + name + ' with expiration date: ' + (expirationDate ? (<Moment>expirationDate).format('YYYY-MM-DD HH:mm:ss') : 'never') + ' and a forced expiration date: ' + (forcedExpirationDate ? (<Moment>forcedExpirationDate).format('YYYY-MM-DD HH:mm:ss') : 'never'), value);

		var item = {
			name                : name,
			value               : JSON.stringify(value),
			expiration          : expirationDate !== 0 ? (<Moment>expirationDate).unix() : expirationDate,
			forcedExpirationDate: forcedExpirationDate !== 0 ? (<Moment>forcedExpirationDate).unix() : forcedExpirationDate,
			tags                : tags ? tags : []
		};

		this.storeInstance.set(name, item);
	}

	/**
	 * @param item
	 * @returns {boolean}
	 */
	private isExpired( item: {name: string, expiration: number, forcedExpirationDate: number} ): boolean {

		if ( item.forcedExpirationDate != 0 && item.forcedExpirationDate < moment().unix() ) {
			this.log('Item ' + item.name + ' is expired.');
			this.remove(item.name);
			return true;
		}

		if ( item.expiration != 0 && item.expiration < moment().unix() ) {
			this.log('Item ' + item.name + ' is expired but can still use it for now.');
			this.remove(item.name);
		}

		return false;
	}
}
