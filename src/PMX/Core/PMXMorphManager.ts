import PMXMorph from "./PMXMorph";
import PMXModel from "./PMXModel";
class PMXMorphManager {
  public postProcessFlag: boolean[] = [false, false, false, false, false, false, false, false, false];

  private _morphs: PMXMorph[];

  private _model: PMXModel;

  private _morphsDictionary: { [morphName: string]: PMXMorph } = {};

  constructor(model: PMXModel) {
    this._model = model;
    this._morphs = new Array(model.ModelData.Morphs.length);
    for (let i = 0; i < model.ModelData.Morphs.length; ++i) {
      this._morphs[i] = PMXMorph.createMorph(model, i, this);
      if (this._morphs[i] != null) {
        this._morphsDictionary[this._morphs[i].MorphName] = this._morphs[i];
      }
    }
  }

  public applyMorph(): void {
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

  public getMorphByName(name: string): PMXMorph {
    return this._morphsDictionary[name];
  }

  public getMorphByIndex(index: number): PMXMorph {
    return this._morphs[index];
  }
}

export default PMXMorphManager;
