/**
 * preference object.
 * if set `window.GrimoireJS` before GrimoireJS is loaded, set it to `gr.libraryPreference`.
 */
export default interface ILibraryPreference {
    /**
     * grimoire waits loading this promise.
     */
    postponeLoading?: Promise<any>;

    /**
     * listen event before loading.
     */
    listen: { [event: string]: Function };
    [otherPreference: string]: any;
}
