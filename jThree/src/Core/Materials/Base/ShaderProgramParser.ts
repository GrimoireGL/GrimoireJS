import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import MaterialManager = require("./MaterialManager");
class ShaderProgramParser {
    public static parseCombined(combined: string, vsfunc: string, fsfunc: string): string {
        var materialManager = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
        var result = ShaderProgramParser.parseImport(combined,materialManager);
        var flagment = ShaderProgramParser.removeOtherPartCode(result,"vertonly");
        var vertex = ShaderProgramParser.removeOtherPartCode(result,"fragonly");
        debugger;
        return result;
    }

    private static parseImport(source: string,materialManager:MaterialManager): string {
        while (true) {
            var regexResult = /\s*\/\/+\s*@import\s+([a-zA-Z0-9.-]+)/.exec(source);
            if(!regexResult)break;
            var importContent;
            importContent = materialManager.getShaderChunk(regexResult[1]);
            if(!importContent)
            {
              console.error(`Required shader chunk '${regexResult[1]}' was not found!!`);
              importContent = "";
            }
            var source = source.replace(regexResult[0],importContent);
        }
        return source;
    }

    private static removeOtherPartCode(source:string,partFlag:string):string
    {
      var regex = new RegExp(`\s*\/\/+\s*@${partFlag}`);
      while(true)
      {
        var found = regex.exec(source);
        if(!found)break;//When there was no more found
        var beginPoint = found.index;

        var index = beginPoint;
        while(true)//ignore next {
        {
          index++;
          if(source[index]=='{')break;
        }

        var bracketCount = 1;
        while(true)
        {
          index++;
          if(index==source.length)
          {
            //error no bracket matching
            console.error("Invalid bracket matching!");
            return source;
          }
          if(source[index]=='{')bracketCount++;
          if(source[index]=='}')bracketCount--;
          if(bracketCount == 0)break;
        }
        var endPoint = index + 1;
        source = source.substr(0,beginPoint) + source.substring(endPoint,source.length);
      }
      return source;
    }
}

export = ShaderProgramParser;
