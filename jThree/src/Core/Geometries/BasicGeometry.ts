import IVariableInfo = require("../Materials/Base/IVariableInfo");
import ProgramWrapper = require("../Resources/Program/ProgramWrapper");
import IndexedGeometry = require("./IndexedGeometry");
import PrimitiveTopology = require("../../Wrapper/PrimitiveTopology");
import Buffer = require("../Resources/Buffer/Buffer");
class BasicGeometry extends IndexedGeometry
{
  public positionBuffer: Buffer;
  public normalBuffer: Buffer;
  public uvBuffer: Buffer;

  public applyAttributeVariables(pWrapper: ProgramWrapper, attributes: { [key: string]: IVariableInfo }): void {
      if(attributes["position"])
      {
        pWrapper.assignAttributeVariable("position",this.positionBuffer);
      }
      if(attributes["normal"])
      {
        pWrapper.assignAttributeVariable("normal",this.normalBuffer);
      }
      if(attributes["uv"])
      {
        pWrapper.assignAttributeVariable("uv",this.uvBuffer);
      }
 }
}

export = BasicGeometry;
