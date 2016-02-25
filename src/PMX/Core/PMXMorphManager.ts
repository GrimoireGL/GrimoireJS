import PMXMorph from "./PMXMorph";
import PMXModel from "./PMXModel";
class PMXMorphManager {
  public postProcessFlag: boolean[] = [false, false, false, false, false, false, false, false, false];

  private morphs: PMXMorph[];

  private model: PMXModel;

  private morphsDictionary: { [morphName: string]: PMXMorph } = {};

  constructor(model: PMXModel) {
    this.model = model;
    this.morphs = new Array(model.ModelData.Morphs.length);
    for (let i = 0; i < model.ModelData.Morphs.length; ++i) {
      this.morphs[i] = PMXMorph.createMorph(model, i, this);
      if (this.morphs[i] != null) {
        this.morphsDictionary[this.morphs[i].MorphName] = this.morphs[i];
      }
    }
  }

  public applyMorph() {
    for (let i = 0; i < this.morphs.length; ++i) {
      if (this.morphs[i] != null) {
        this.morphs[i].update();
      }
    }
    for (let i = 0; i < this.postProcessFlag.length; i++) {
      if (this.postProcessFlag[i]) {
        PMXMorph.postProcess(this.model, i);
        this.postProcessFlag[i] = false;
      }
    }
  }

  public getMorphByName(name: string) {
    return this.morphsDictionary[name];
  }

  public getMorphByIndex(index: number) {
    return this.morphs[index];
  }
}

export default PMXMorphManager;
