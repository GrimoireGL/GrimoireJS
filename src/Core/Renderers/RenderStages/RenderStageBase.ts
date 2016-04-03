import IGLContainer from "../../Canvas/GL/IGLContainer";
import IRenderer from "../IRenderer";
import IShaderArgumentContainer from "../../Materials/IShaderArgumentContainer";
import IRenderStageRendererConfigure from "./IRenderStageRendererConfigure";
import JThreeObjectWithID from "../../../Base/JThreeObjectWithID";
import SceneObject from "../../SceneObjects/SceneObject";
import Scene from "../../Scene";
import BufferInput from "../BufferInput";
abstract class RenderStageBase extends JThreeObjectWithID implements IShaderArgumentContainer, IGLContainer {
  public static defaultRendererConfigure: IRenderStageRendererConfigure = {
    cullOrientation: "BACK",
    depthEnabled: true,
    depthMode: "LESS",
    depthMask: true,
    blendEnabled: true,
    blendSrcFactor: "SRC_ALPHA",
    blendDstFactor: "ONE_MINUS_SRC_ALPHA",
    redMask: true,
    greenMask: true,
    blueMask: true,
    alphaMask: true
  };

  public shaderVariables: { [key: string]: any } = {};

  public bufferTextures: BufferInput = { defaultRenderBuffer: null };

  public gl: WebGLRenderingContext;

  constructor(public renderer: IRenderer) {
    super();
    this.gl = renderer.gl;
  }

  public abstract getDefaultRendererConfigure(techniqueIndex: number): IRenderStageRendererConfigure;

  public preStage(scene: Scene): void {
    return;
  }

  public postStage(scene: Scene): void {
    return;
  }

	/**
	 * This method will be called before process render in each pass
	 */
  public preTechnique(scene: Scene, techniqueIndex: number): void {
    return;
  }
	/**
	 * This method will be called after process render in each pass.
	 */
  public postTechnique(scene: Scene, techniqueIndex: number): void {
    return;
  }

  public abstract render(scene: Scene, object: SceneObject, techniqueCount: number, techniqueIndex: number): void;

  public abstract getTechniqueCount(scene: Scene): number;

  public abstract getTarget(techniqueIndex: number): string;
}

export default RenderStageBase;
