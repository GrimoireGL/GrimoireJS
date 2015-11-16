class ContextComponents
{
  public static get SceneManager():number
  {
    return 0;
  }

  public static get CanvasManager():number
  {
    return 1;
  }

  public static get ResourceManager():number
  {
    return 2;
  }

  public static get NodeManager():number
  {
    return 3;
  }

  public static get LoopManager():number
  {
    return 4;
  }

  public static get Timer():number
  {
    return 5;
  }

  public static get Debugger():number
  {
    return 6;
  }
}

export = ContextComponents;
