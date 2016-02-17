import Scene from "../Core/Scene";
import BasicRenderer from "../Core/Renderers/BasicRenderer";
import RendererDebugger from "./Modules/RendererDebugger";
interface DebuggerInfomationAPI {
  setInfo(key: string, data: number|string);
}
interface DebuggerRendererAPI {
  addRenderer(renderer: BasicRenderer, debug: RendererDebugger);
}

interface DebuggerSceneStructureAPI {
  setScene(sceneName: string, scene: Scene);
}
interface DebuggerAPI {
  info: DebuggerInfomationAPI;
  scenes: DebuggerSceneStructureAPI;
  renderers: DebuggerRendererAPI;
}

export default DebuggerAPI;
