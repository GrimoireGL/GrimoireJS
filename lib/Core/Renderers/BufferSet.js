import TextureGenerater from "./TextureGenerater";
/**
 * The class managing all buffer textures used for rendering in a BasicRenderer.
 */
class BufferSet {
    constructor(renderer) {
        /**
         * The color buffers managed by this class.
         */
        this._colorBuffers = {};
        this._renderer = renderer;
    }
    /**
     * Generate new buffer and append list.
     * @param {GeneraterInfoChunk} argument [description]
     */
    appendBuffer(argument) {
        if (this._colorBuffers[argument.name]) {
            console.error(`The color buffer ${argument.name} is already exist.`);
            return;
        }
        else {
            this._colorBuffers[argument.name] = TextureGenerater.generateTexture(this._renderer, argument);
        }
    }
    appendBuffers(args) {
        for (let i = 0; i < args.length; i++) {
            this.appendBuffer(args[i]);
        }
    }
    /**
     * Remove buffer and dispose.
     * @param {string} name [description]
     */
    removeBuffer(name) {
        if (this._colorBuffers[name]) {
            this._colorBuffers[name].dispose();
            delete this._colorBuffers[name];
        }
    }
    getColorBuffer(name) {
        return this._colorBuffers[name];
    }
}
export default BufferSet;
