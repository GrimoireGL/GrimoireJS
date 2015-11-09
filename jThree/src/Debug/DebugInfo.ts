class DebugInfo
{
  public static setInfo(key:string,info:string|number)
  {
    if(window["j3d"])window["j3d"].info.setInfo(key,info);
  }
}

export = DebugInfo;
