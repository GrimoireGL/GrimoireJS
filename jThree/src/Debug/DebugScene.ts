class DebugScene{

  private static sceneDebugAPIs = {};
  public static setScene(sceneName:string)
  {
    if(window["j3d"])
    {
      var debugApi = window["j3d"].scenes.setScene(sceneName);
      DebugScene.sceneDebugAPIs[sceneName] = debugApi;
      return debugApi;
    }
  }

  public static getSceneApi(sceneName:string)
  {
    return DebugScene.sceneDebugAPIs[sceneName];
  }
}

export = DebugScene;
