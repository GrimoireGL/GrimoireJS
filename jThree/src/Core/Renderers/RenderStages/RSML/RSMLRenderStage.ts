import IRenderStageRendererConfigure = require("../IRenderStageRendererConfigure");
import BasicTechnique = require("./BasicTechnique");
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

    public techniques:BasicTechnique[];

    public getDefaultRendererConfigure(techniqueIndex:number):IRenderStageRendererConfigure
    {
      return this.techniques[techniqueIndex].defaultRenderConfigure;
    }

    public getSuperRendererConfigure():IRenderStageRendererConfigure
    {
      return super.getDefaultRendererConfigure(0);
    }

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
      this.techniques = new Array(this._techniqueCount);
      for(let techniqueIndex = 0; techniqueIndex < this._techniqueCount; techniqueIndex ++)
      {
        this.techniques[techniqueIndex] = new BasicTechnique(this,techniqueTags.item(techniqueIndex));
      }
    }

    public preTechnique(scene: Scene, techniqueIndex: number, texs: ResolvedChainInfo) {
      this.techniques[techniqueIndex].preTechnique(scene,texs);
    }

    public render(scene: Scene, object: SceneObject, techniqueIndex: number, texs: ResolvedChainInfo) {
      this.techniques[techniqueIndex].render(scene,object,techniqueIndex,texs);
    }

    public needRender(scene: Scene, object: SceneObject, techniqueIndex: number): boolean {
        return typeof object.Geometry != "undefined" && object.Geometry != null;
    }

    public getTechniqueCount(scene: Scene) {
        return this._techniqueCount;
    }

    public getTarget(techniqueIndex:number):string
    {
      return this.techniques[techniqueIndex].Target;
    }
}

export = RSMLRenderStage;
