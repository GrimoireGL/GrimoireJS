import IParsedProgramResult = require("./IParsedProgramResult");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import MaterialManager = require("./MaterialManager");
class ShaderProgramParser {
    public static parseCombined(combined: string): IParsedProgramResult {
        var materialManager = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
        var result = ShaderProgramParser.parseImport(combined,materialManager);
        var fragment = ShaderProgramParser._removeOtherPart(result,"vertonly");
        var vertex = ShaderProgramParser._removeOtherPart(result,"fragonly");
        fragment = ShaderProgramParser._removeAttributeVariables(fragment);
        return {
          vertex:vertex,
          fragment:fragment
        };
    }

    public static parseImport(source: string,materialManager:MaterialManager): string {
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

    private static _removeOtherPart(source:string,partFlag:string):string
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
        while(true)//find matching bracket
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

    private static _removeAttributeVariables(source:string):string
    {
      var regex =/(\s*attribute\s+[a-zA-Z0-9_]+\s+[a-zA-Z0-9_]+;)/;
      while(true)
      {
        var found = regex.exec(source);
        if(!found)break;
        source = source.replace(found[0],"");
      }
      return source;
    }
}

export = ShaderProgramParser;
