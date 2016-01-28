import HitAreaRenderStage = require("./RenderStages/HitAreaRenderStage");
import RSMLRenderStage = require("./RenderStages/RSML/RSMLRenderStage");
import BasicRenderer = require("./BasicRenderer");
import RenderStageBase = require("./RenderStages/RenderStageBase");
import ContextComponents = require("../../ContextComponents");
import IContextComponent = require("../../IContextComponent");
import Delegates = require("../../Base/Delegates");
class RenderStageRegistory implements IContextComponent {
  private _renderStageFactoryFunctions: { [key: string]: Delegates.Func1<BasicRenderer, RenderStageBase> } = {};

  constructor() {
    this.register("jthree.hitarea", (renderer) => new HitAreaRenderStage(renderer));
    this.register(require("./RenderStages/BuiltIn/GBuffer.html"));
    this.register(require("./RenderStages/BuiltIn/LightAccumulationStage.html"));
    this.register(require("./RenderStages/BuiltIn/ForwardShading.html"));
    this.register(require("./RenderStages/BuiltIn/Fog.html"));
    this.register(require("./RenderStages/BuiltIn/FogExp2.html"));
    this.register(require("./RenderStages/BuiltIn/SkyBox.html"));
    this.register(require("./RenderStages/BuiltIn/FXAA.html"));
  }

  public getContextComponentIndex(): number {
    return ContextComponents.RenderStageRegistory;
  }

  /**
   * Register new render stage factory from RSML source.
   * @param {string} source RSML source
   */
  public register(source: string): void;
  /**
   * Register new render stage factory from delegate function.
   * This overload mainly used for registering custum overrided class.
   * @param {string}                            name              the key to be used for constructing the render stage
   * @param {Delegates.Func1<BasicRenderer, RenderStageBase>} factory       factory function for constructing the render stage
   */
  public register(name: string, factory: Delegates.Func1<BasicRenderer, RenderStageBase>): void;
  public register(nameOrsource: string, factory?: Delegates.Func1<BasicRenderer, RenderStageBase>): void {
    if (factory) {
      this._renderStageFactoryFunctions[nameOrsource] = factory;
      return;
    }
    const parser = new DOMParser();
    const rsmlRoot = parser.parseFromString(nameOrsource, "text/xml");
    const stageRoot = rsmlRoot.querySelector("rsml > stage");
    const name = stageRoot.getAttribute("name");
    if (!name) {
      console.error(`The name field was not found in RSML file.\n${nameOrsource}`);
      return;
    }
    this._renderStageFactoryFunctions[name] = (renderer: BasicRenderer) => new RSMLRenderStage(renderer, nameOrsource);
  }

  /**
   * Construct new render stage related to specifed key.
   * @param  {string}          name     the key to identify render stage
   * @param  {BasicRenderer}   renderer the renderer being going to hold generated render stage base
   * @return {RenderStageBase}          generated render stage base
   */
  public construct(name: string, renderer: BasicRenderer): RenderStageBase {
    return this._renderStageFactoryFunctions[name](renderer);
  }
}
export = RenderStageRegistory;
