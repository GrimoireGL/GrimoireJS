import Scene = require("../Core/Scene");
import BasicRenderer = require("../Core/Renderers/BasicRenderer");
import RendererDebugger = require("./Modules/RendererDebugger");
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

export = DebuggerAPI;
