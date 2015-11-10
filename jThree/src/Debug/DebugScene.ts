class DebugScene{
  public static setScene(sceneName:string)
  {
    if(window["j3d"])window["j3d"].scenes.setScene(sceneName);
  }
}

export = DebugScene;
