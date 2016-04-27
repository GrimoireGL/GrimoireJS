import IRenderStageRendererConfigure from "../IRenderStageRendererConfigure";
import BasicTechnique from "./BasicTechnique";
import BasicRenderer from "../../BasicRenderer";
import SceneObject from "../../../SceneObjects/SceneObject";
import RenderStageBase from "../RenderStageBase";
import Scene from "../../../Scene";
import XMLReader from "../../../../Base/XMLReader";
class BasicRenderStage extends RenderStageBase {
    public techniques: BasicTechnique[];

    private _parsedRSML: Document;

    private _techniqueCount: number;

    private _stageName: string;

    constructor(renderer: BasicRenderer, rsmlSource: string) {
        super(renderer);
        this._parseRSML(rsmlSource);
    }

    public get stageName(): string {
        return this._stageName;
    }

    public getDefaultRendererConfigure(techniqueIndex: number): IRenderStageRendererConfigure {
        return this.techniques[techniqueIndex].defaultRenderConfigure;
    }

    public getSuperRendererConfigure(): IRenderStageRendererConfigure {
        return RenderStageBase.defaultRendererConfigure;
    }

    public preTechnique(scene: Scene, techniqueIndex: number): void {
        this.techniques[techniqueIndex].preTechnique(scene);
    }

    public render(scene: Scene, object: SceneObject, techniqueCount: number, techniqueIndex: number): void {
        this.techniques[techniqueIndex].render(scene, object, techniqueCount, techniqueIndex);
    }

    public getTechniqueCount(scene: Scene): number {
        return this._techniqueCount;
    }

    public getTarget(techniqueIndex: number): string {
        return this.techniques[techniqueIndex].Target;
    }

    private _parseRSML(source: string): void {
        this._parsedRSML = XMLReader.parseXML(source);
        const rsmlTag = XMLReader.getSingleElement(this._parsedRSML, "rsml", true);
        const stageTag = XMLReader.getSingleElement(rsmlTag, "stage", true);
        if (!stageTag) {
            console.error("Stage tag was not found in RSML");
            return;
        }
        this._stageName = stageTag.getAttribute("name");
        const techniqueTags = stageTag.querySelectorAll("technique");
        this._techniqueCount = techniqueTags.length;
        this.techniques = new Array(this._techniqueCount);
        for (let techniqueIndex = 0; techniqueIndex < this._techniqueCount; techniqueIndex++) {
            this.techniques[techniqueIndex] = new BasicTechnique(this, techniqueTags.item(techniqueIndex), techniqueIndex);
        }
    }
}

export default BasicRenderStage;
