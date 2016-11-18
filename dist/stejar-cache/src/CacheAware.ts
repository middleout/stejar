import { CacheService } from "./CacheService";

export interface CacheAware {

	/**
	 * @param cacheService
	 */
	setCacheService( cacheService: CacheService ): void;
}
