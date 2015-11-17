interface DebuggerInfomationAPI
{
  setInfo(key:string,data:number|string);
}

interface DebuggerSceneStructureAPI
{
  setScene(sceneName:string);
}
interface DebuggerAPI
{
  info:DebuggerInfomationAPI;
  scenes:DebuggerSceneStructureAPI;
}

export = DebuggerAPI;
