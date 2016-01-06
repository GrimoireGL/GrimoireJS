import BasicRenderer = require('../../BasicRenderer');
import SceneObject = require('../../../SceneObject');
import RenderStageBase = require('../RenderStageBase');
import Scene = require('../../../Scene');
import ResolvedChainInfo = require('../../ResolvedChainInfo');
import ClearTargetType = require("../../../../Wrapper/ClearTargetType");
import RenderStageConfig = require("../../RenderStageConfig");
class RSMLRenderStage extends RenderStageBase {

    private _parsedRSML:Document;

    private _techniqueCount:number;

    private _targetGeometry:string;

    constructor(renderer: BasicRenderer,rsmlSource:string) {
        super(renderer);
        this._parseRSML(rsmlSource);
    }

    private _parseRSML(source:string):void
    {
      this._parsedRSML = (new DOMParser()).parseFromString(source,"text/xml");
      const stageTag = this._parsedRSML.querySelector("rsml > stage");
      if(!stageTag)
      {
        console.error("Stage tag was not found in RSML");
        return;
      }
      const techniqueTags = stageTag.querySelectorAll("technique");
      this._techniqueCount = techniqueTags.length;
    }

    public preTechnique(scene: Scene, passCount: number, texs: ResolvedChainInfo) {
        this.bindAsOutBuffer(this.DefaultFBO, [{
            texture: null,
            target: "depth",
            type: "rbo"
        }, {
                texture: texs["OUT"],
                target: 0,
                isOptional: false
            }], () => {
                this.Renderer.GL.clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits);
            }, () => {
                this.Renderer.GL.clear(ClearTargetType.DepthBits);
            });
    }

    public render(scene: Scene, object: SceneObject, passCount: number, texs: ResolvedChainInfo) {
        this.drawForMaterials(scene, object, passCount, texs, "jthree.materials.forematerial");
    }

    public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
        return typeof object.Geometry != "undefined" && object.Geometry != null;
    }

    public getTechniqueCount(scene: Scene) {
        return this._techniqueCount;
    }
}

export = RSMLRenderStage;
