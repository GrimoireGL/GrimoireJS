import Scene = require("./Scene");
interface IParentSceneChangedEventArgs
{
  lastParentScene:Scene;
  currentParentScene:Scene;
}

export =  IParentSceneChangedEventArgs;
