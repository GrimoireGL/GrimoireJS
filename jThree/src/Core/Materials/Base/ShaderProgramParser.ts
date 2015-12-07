import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import MaterialManager = require("./MaterialManager");
class ShaderProgramParser {
    public static parseCombined(combined: string,vsfunc:string,fsfunc:string):string {
        var materialManager = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
        
  }
}

export = ShaderProgramParser;
