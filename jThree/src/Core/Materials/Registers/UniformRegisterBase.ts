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
  private childFunctions:MaterialConfigureFunc[]=[];

  protected __addChildFunctionIfVariableExist(program:Program,variableName:string,configureFunc:MaterialConfigureFunc):void
  {
    if(program.uniformExists(variableName))this.childFunctions.push(configureFunc);
  }

  public initializeForProgram(program:Program)
  {
  }

  public getRegisterFunction(program:Program):MaterialConfigureFunc
  {
    return (wrapper,scene,renderer,object,pathInfo,technique,pass)=>
    {
      this.childFunctions.forEach(f=>
      {
        f(wrapper,scene,renderer,object,pathInfo,technique,pass);
      });
    };
  }
}

export = UniformRegisterBase;
