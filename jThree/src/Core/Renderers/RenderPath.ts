import RenderStageChain = require("./RenderStageChain");
class RenderPath {
  public path: RenderStageChain[] = [];

  public pushStage(stage: RenderStageChain) {
    this.path.push(stage);
  }

  public insertWithIndex(index: number, stage: RenderStageChain) {
    if (index >= 0 && index <= this.path.length) {
      const newStageChain = new Array(this.path.length + 1);
      for (let i = 0; i < index; i++) {
        newStageChain[i] = this.path[i];
      }
      newStageChain[index] = stage;
      for (let i = index + 1; i < newStageChain.length; i++) {
        newStageChain[i] = this.path[i - 1];
      }
      this.path = newStageChain;
    } else {
      console.error(`Invalid render stage index : ${index}, Current length of stage chain is $${this.path.length}`);
    }
  }

  public deleteWithIndex(index: number) {
    if (index >= 0 && index < this.path.length && this.path.length > 0) {
      const newStageChain = new Array(this.path.length - 1);
      for (let i = 0; i < index; i++) {
        newStageChain[i] = this.path[i];
      }
      for (let i = index; i < newStageChain.length; i++) {
        newStageChain[i] = this.path[i + 1];
      }
      this.path = newStageChain;
    } else {
      console.error(`Invalid render stage index:${index}, Current length of stage chain is ${this.path.length}`);
    }
  }

  public deleteStage(stage: RenderStageChain) {
    for (let i = 0; i < this.path.length; i++) {
      if (this.path[i] === stage) {
        this.deleteWithIndex(i);
        return;
      }
    }
    console.warn("Couldn't find specified RenderStage, any render stage was not deleted");
  }

  public insertAfter(targetStage: RenderStageChain, stage: RenderStageChain) {
    for (let i = 0; i < this.path.length; i++) {
      if (this.path[i] === stage) {
        this.insertWithIndex(i + 1, stage);
        return;
      }
    }
    console.error("Invalid render stage chain.Specified targetsStage was not found.");
  }

  public insertBefore(targetStage: RenderStageChain, stage: RenderStageChain) {
    for (let i = 0; i < this.path.length; i++) {
      if (this.path[i] === stage) {
        this.insertWithIndex(i, stage);
        return;
      }
    }
    console.error("Invalid render stage chain. Specified targetStage was not found");
  }
}

export = RenderPath;
