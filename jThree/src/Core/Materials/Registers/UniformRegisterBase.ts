import BasicRenderer = require("../../Renderers/BasicRenderer");
import ProgramWrapper = require("../../Resources/Program/ProgramWrapper");
import Program = require("../../Resources/Program/Program");
import ResolvedChainInfo = require("../../Renderers/ResolvedChainInfo");
import SceneObject = require("../../SceneObject");
import Scene = require("../../Scene");
import Delegates = require("../../../Base/Delegates");
declare type MaterialConfigureFunc = Delegates.Action7<ProgramWrapper,Scene,BasicRenderer,SceneObject,ResolvedChainInfo,number,number>;
class UniformRegisterBase
{
  public getRegisterFunction(program:Program):MaterialConfigureFunc
  {
    return ()=>{};
  }

  public get name()
  {
    return undefined;
  }
}

export = UniformRegisterBase;
