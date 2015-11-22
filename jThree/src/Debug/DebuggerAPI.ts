import Scene = require("../Core/Scene");
import RendererBase = require("../Core/Renderers/RendererBase");
import RendererDebugger = require("./Modules/RendererDebugger");
interface DebuggerInfomationAPI
{
  setInfo(key:string,data:number|string);
}
interface DebuggerRendererAPI
{
  addRenderer(renderer:RendererBase,debug:RendererDebugger);
}

interface DebuggerSceneStructureAPI
{
  setScene(sceneName:string,scene:Scene);
}
interface DebuggerAPI
{
  info:DebuggerInfomationAPI;
  scenes:DebuggerSceneStructureAPI;
  renderers:DebuggerRendererAPI;
}

export = DebuggerAPI;
