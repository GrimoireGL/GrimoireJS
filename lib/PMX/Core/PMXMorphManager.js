import PMXMorph from "./PMXMorph";
class PMXMorphManager {
    constructor(model) {
        this.postProcessFlag = [false, false, false, false, false, false, false, false, false];
        this._morphsDictionary = {};
        this._model = model;
        this._morphs = new Array(model.ModelData.Morphs.length);
        for (let i = 0; i < model.ModelData.Morphs.length; ++i) {
            this._morphs[i] = PMXMorph.createMorph(model, i, this);
            if (this._morphs[i] != null) {
                this._morphsDictionary[this._morphs[i].MorphName] = this._morphs[i];
            }
        }
    }
    applyMorph() {
        for (let i = 0; i < this._morphs.length; ++i) {
            if (this._morphs[i] != null) {
                this._morphs[i].update();
            }
        }
        for (let i = 0; i < this.postProcessFlag.length; i++) {
            if (this.postProcessFlag[i]) {
                PMXMorph.postProcess(this._model, i);
                this.postProcessFlag[i] = false;
            }
        }
    }
    getMorphByName(name) {
        return this._morphsDictionary[name];
    }
    getMorphByIndex(index) {
        return this._morphs[index];
    }
}
export default PMXMorphManager;
