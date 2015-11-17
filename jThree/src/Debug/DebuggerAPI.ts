import Scene = require("../Core/Scene");
interface DebuggerInfomationAPI
{
  setInfo(key:string,data:number|string);
}

interface DebuggerSceneStructureAPI
{
  setScene(sceneName:string,scene:Scene);
}
interface DebuggerAPI
{
  info:DebuggerInfomationAPI;
  scenes:DebuggerSceneStructureAPI;
}

export = DebuggerAPI;
