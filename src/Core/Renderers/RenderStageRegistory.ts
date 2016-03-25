import HitAreaRenderStage from "./RenderStages/HitAreaRenderStage";
import BasicRenderStage from "./RenderStages/Base/BasicRenderStage";
import BasicRenderer from "./BasicRenderer";
import RenderStageBase from "./RenderStages/RenderStageBase";
import ContextComponents from "../../ContextComponents";
import IContextComponent from "../../IContextComponent";
class RenderStageRegistory implements IContextComponent {
  private _renderStageFactoryFunctions: { [key: string]: (r: BasicRenderer) => RenderStageBase } = {};

  constructor() {
    this.register("jthree.hitarea", (renderer) => new HitAreaRenderStage(renderer));
    this.register(require("./RenderStages/BuiltIn/GBuffer.rsml"));
    this.register(require("./RenderStages/BuiltIn/LightAccumulationStage.rsml"));
    this.register(require("./RenderStages/BuiltIn/ForwardShading.rsml"));
    this.register(require("./RenderStages/BuiltIn/Fog.rsml"));
    this.register(require("./RenderStages/BuiltIn/FogExp2.rsml"));
    this.register(require("./RenderStages/BuiltIn/Skybox.rsml"));
    this.register(require("./RenderStages/BuiltIn/FXAA.rsml"));
    this.register(require("./RenderStages/BuiltIn/Sobel.rsml"));
    this.register(require("./RenderStages/BuiltIn/Gaussian.rsml"));
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
   * @param {Func1<BasicRenderer, RenderStageBase>} factory       factory function for constructing the render stage
   */
  public register(name: string, factory: (r: BasicRenderer) => RenderStageBase): void;
  public register(nameOrsource: string, factory?: (r: BasicRenderer) => RenderStageBase): void {
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
    this._renderStageFactoryFunctions[name] = (renderer: BasicRenderer) => new BasicRenderStage(renderer, nameOrsource);
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
export default RenderStageRegistory;
