import IViewport from "../Canvas/IViewport";
import ICanvasContainer from "../Canvas/ICanvasContainer";
import IDisposable from "../../Base/IDisposable";
import Scene from "../Scene";
import Camera from "../SceneObjects/Camera/Camera";
import IGLContainer from "../Canvas/GL/IGLContainer";
/**
 * 特定領域の描画を司るクラスのインターフェース
 * @type {[type]}
 */
interface IRenderer extends NodeJS.EventEmitter, IDisposable, IGLContainer, ICanvasContainer, IViewport {
  /**
   * [The camera instance that this renderer refer to]
   * @type {Camera}
   */
  camera: Camera;

  render(scene: Scene): void;

  beforeRender(): void;

  afterRender(): void;

  applyViewport(isDefaultBuffer: boolean): void;

}

export default IRenderer;
