import IStageRecipe from "./Recipe/IStageRecipe";
import IDisposable from "../../Base/IDisposable";
import IRenderer from "./IRenderer";
import RenderStageRegistory from "./RenderStageRegistory";
import RenderStageChain from "./RenderStageChain";
/**
 * レンダリングの順序を管理しているクラス
 */
class RenderPath implements IDisposable {
    /**
     * レンダリングの順序の配列
     * @type {RenderStageChain[]}
     */
    public path: RenderStageChain[] = [];

    constructor(private _renderer: IRenderer) {
    }

    public appendStage(stage: IStageRecipe): void {
        this.path.push(this._fromTemplate(stage));
    }

    public appendStages(templates: IStageRecipe[]): void {
        templates.forEach((e) => {
            this.path.push(this._fromTemplate(e));
        });
    }

    public insertWithIndex(index: number, stage: IStageRecipe): void {
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

    public deleteWithIndex(index: number): void {
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

    public dispose(): void {
        while (this.path.length >= 1) {
            this._disposeStage(this.path.splice(this.path.length - 1, 1)[0]);
        }
    }

    private _fromTemplate(template: IStageRecipe): RenderStageChain {
        return {
            buffers: template.buffers,
            stage: RenderStageRegistory.construct(template.stage, this._renderer),
            variables: template.variables || {}
        };
    }

    private _disposeStage(pathElement: RenderStageChain): void {
        pathElement.stage.dispose();
    }
}

export default RenderPath;
