/**
 * The interface to support simple iteration for generic types.
 */
interface IEnumrator<T> {
    getCurrent(): T;
    next(): boolean;
}

export=IEnumrator;
