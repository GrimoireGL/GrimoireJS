export default interface ILibraryPreference {
    /**
     * grimoire waits loading this promise.
     */
    postponeLoading?: Promise<any>;
    [otherPreference: string]: any;
}
