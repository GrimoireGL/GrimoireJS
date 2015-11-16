interface DebuggerInfomationAPI
{
  setInfo(key:string,data:number|string);
}
interface DebuggerAPI
{
  info:DebuggerInfomationAPI;
}

export = DebuggerAPI;
