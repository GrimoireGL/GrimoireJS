import IRenderer from "./IRenderer";
import ContextComponents from "../../ContextComponents";
import RenderStageRegistory from "./RenderStageRegistory";
import JThreeContext from "../../JThreeContext";
import PathRecipe from "./PathRecipe";
import RenderStageChain from "./RenderStageChain";
/**
 * レンダリングの順序を管理しているクラス
 */
class RenderPath {
    /**
     * レンダリングの順序の配列
     * @type {RenderStageChain[]}
     */
    public path: RenderStageChain[] = [];

    constructor(private _renderer: IRenderer) {
    }

    /**
     * Remove all contained pathes.
     */
    public clear(): void {
        while (this.path.length >= 1) {
            this.path.splice(this.path.length - 1, 1)[0]
        }
    }

    public pushStage(stage: PathRecipe): void {
        this.path.push(this._fromTemplate(stage));
    }

    public fromPathTemplate(templates: PathRecipe[]): void {
        templates.forEach((e) => {
            this.path.push(this._fromTemplate(e));
        });
    }

    public insertWithIndex(index: number, stage: PathRecipe): void {
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

    private _fromTemplate(template: PathRecipe): RenderStageChain {
        const rr = JThreeContext.getContextComponent<RenderStageRegistory>(ContextComponents.RenderStageRegistory);
        return {
            buffers: template.buffers,
            stage: rr.construct(template.stage, this._renderer),
            variables: template.variables || {}
        };
    }

    private _disposeStage(pathElement: RenderStageChain): void {

    }
}

export default RenderPath;
