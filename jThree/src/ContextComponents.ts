class ContextComponents {
  public static get SceneManager(): number {
    return 0;
  }

  public static get CanvasManager(): number {
    return 1;
  }

  public static get ResourceManager(): number {
    return 2;
  }

  public static get NodeManager(): number {
    return 3;
  }

  public static get LoopManager(): number {
    return 4;
  }

  public static get Timer(): number {
    return 5;
  }

  public static get Debugger(): number {
    return 6;
  }

  public static get ResourceLoader(): number {
    return 7;
  }

  public static get MaterialManager(): number {
    return 8;
  }

  public static get PrimitiveRegistory(): number {
    return 9;
  }

  public static get RenderStageRegistory(): number {
    return 10;
  }
}

export = ContextComponents;
