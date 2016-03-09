/**
 * Provides abstraction for texture generation.
 * By overriding, it is able to manage texture buffer in your way.
 */
class GeneraterBase {
    constructor(parent) {
        this.__parentRenderer = parent;
    }
}
export default GeneraterBase;
