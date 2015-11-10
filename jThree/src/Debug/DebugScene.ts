class DebugScene{
  public static setScene(sceneName:string)
  {
    if(window["j3d"])
    {
      window["j3d"].scenes.setScene(sceneName);
      return window["j3d"].scenes.scenes[sceneName].api;
    }
  }
}

export = DebugScene;
