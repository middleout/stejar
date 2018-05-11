export class AbstractProvider {
    /**
     * An example method which you should implement an override yourself
     * Should return either a string or the class you wish this provider to provide.
     */
    provides() {
        throw new Error("Abstract method provides() should not be called directly");
    }

    /* eslint-disable no-unused-vars */
    /**
     * An example method which you should implement an override yourself
     * Should return the instance of the class you set at the "provides()" method above.
     * It *can* optionally set other resources in the service manager but ideally you shouldn't.
     *
     * @param serviceManager
     * @returns {T}
     */
    provide(serviceManager) {
        throw new Error("Abstract method provide(serviceManager) should not be called directly");
    }
    /* eslint-enable no-unused-vars */
}
