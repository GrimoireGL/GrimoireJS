import Scene from "../Scene";
import RBO from "../Resources/RBO/RBO";
import BufferSet from "./BufferSet";
import RenderPath from "./RenderPath";
import Camera from "../SceneObjects/Camera/Camera";
interface IRenderer extends NodeJS.EventEmitter {
  /**
   * [The camera instance that this renderer refer to]
   * @type {Camera}
   */
  camera: Camera;

  /**
   * [The render path that this renderer will use]
   * @type {RenderPath}
   */
  renderPath: RenderPath;

  /**
   * The buffer set that contains buffers for this renderer.
   * @type {BufferSet}
   */
  bufferSet: BufferSet;

  /**
   * [defaultRenderBuffer description]
   * @type {RBO}
   */
  defaultRenderBuffer: RBO;

  render(scene: Scene): void;

  beforeRender(): void;

  afterRender(): void;

}

export default IRenderer;
