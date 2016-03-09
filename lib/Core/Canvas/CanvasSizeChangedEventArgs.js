class CanvasSizeChangedEventArg {
    constructor(target, lastWidth, lastHeight, newWidth, newHeight) {
        this._canvas = target;
        this._lastWidth = lastWidth;
        this._lastHeight = lastHeight;
        this._newWidth = newWidth;
        this._newHeight = newHeight;
    }
    get Canvas() {
        return this._canvas;
    }
    get LastWidth() {
        return this._lastWidth;
    }
    get LastHeight() {
        return this._lastHeight;
    }
    get NewWidth() {
        return this._newWidth;
    }
    get NewHeight() {
        return this._newHeight;
    }
}
export default CanvasSizeChangedEventArg;
