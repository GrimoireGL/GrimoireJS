import BasicRenderer = require("./BasicRenderer");
import ContextComponents = require("../../ContextComponents");
import RenderStageRegistory = require("./RenderStageRegistory");
import JThreeContext = require("../../JThreeContext");
import StageChainTemplate = require("./StageChainTemplate");
import RenderStageChain = require("./RenderStageChain");
class RenderPath {
  public path: RenderStageChain[] = [];

  private _renderer: BasicRenderer;

  constructor(renderer: BasicRenderer) {
    this._renderer = renderer;
  }

  public pushStage(stage: StageChainTemplate) {
    this.path.push(this._fromTemplate(stage));
  }

  public fromPathTemplate(templates: StageChainTemplate[]): void {
    templates.forEach((e) => {
      this.path.push(this._fromTemplate(e));
    });
  }

  public insertWithIndex(index: number, stage: StageChainTemplate) {
    if (index >= 0 && index <= this.path.length) {
      const newStageChain = new Array(this.path.length + 1);
      for (let i = 0; i < index; i++) {
        newStageChain[i] = this.path[i];
      }
      newStageChain[index] = this._fromTemplate(stage);
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

  private _fromTemplate(template: StageChainTemplate): RenderStageChain {
    const rr = JThreeContext.getContextComponent<RenderStageRegistory>(ContextComponents.RenderStageRegistory);
    return {
      buffers: template.buffers,
      stage: rr.construct(template.stage, this._renderer),
      variables: template.variables || {}
    };
  }
}

export = RenderPath;
