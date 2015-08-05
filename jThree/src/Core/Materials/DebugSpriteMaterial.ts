import SpriteMaterial = require('./SpriteMaterial');
declare function require(string): string;

class DebugSpriteMaterial extends SpriteMaterial {
  public get NeedFoward():boolean
  {
    return true;
  }
}

export =DebugSpriteMaterial;
