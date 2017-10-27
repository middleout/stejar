export class AbstractProvider {
    /**
     * @type {typeof T}
     */
    provides() {
        throw new Error("Abstract method provides() should not be called directly");
    }

    /* eslint-disable no-unused-vars */
    /**
     * @param serviceManager
     * @returns {T}
     */
    provide(serviceManager) {
        throw new Error("Abstract method provide(serviceManager) should not be called directly");
    }
    /* eslint-enable no-unused-vars */
}
