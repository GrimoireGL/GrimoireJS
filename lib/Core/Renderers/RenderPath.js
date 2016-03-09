import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
class RenderPath {
    constructor(renderer) {
        this.path = [];
        this._renderer = renderer;
    }
    pushStage(stage) {
        this.path.push(this._fromTemplate(stage));
    }
    fromPathTemplate(templates) {
        templates.forEach((e) => {
            this.path.push(this._fromTemplate(e));
        });
    }
    insertWithIndex(index, stage) {
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
        }
        else {
            console.error(`Invalid render stage index : ${index}, Current length of stage chain is $${this.path.length}`);
        }
    }
    deleteWithIndex(index) {
        if (index >= 0 && index < this.path.length && this.path.length > 0) {
            const newStageChain = new Array(this.path.length - 1);
            for (let i = 0; i < index; i++) {
                newStageChain[i] = this.path[i];
            }
            for (let i = index; i < newStageChain.length; i++) {
                newStageChain[i] = this.path[i + 1];
            }
            this.path = newStageChain;
        }
        else {
            console.error(`Invalid render stage index:${index}, Current length of stage chain is ${this.path.length}`);
        }
    }
    _fromTemplate(template) {
        const rr = JThreeContext.getContextComponent(ContextComponents.RenderStageRegistory);
        return {
            buffers: template.buffers,
            stage: rr.construct(template.stage, this._renderer),
            variables: template.variables || {}
        };
    }
}
export default RenderPath;
