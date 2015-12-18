import IUniformVariableInfo = require("./IUniformVariableInfo");
import IParsedProgramResult = require("./IParsedProgramResult");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import MaterialManager = require("./MaterialManager");
class XMMLParser {
    public static parseCombined(combined: string): IParsedProgramResult {
        var materialManager = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
        var result = XMMLParser.parseImport(combined,materialManager);
        var uniforms = XMMLParser._parseUniforms(combined);
        var fragment = XMMLParser._removeOtherPart(result,"vertonly");
        var vertex = XMMLParser._removeOtherPart(result,"fragonly");
        fragment = XMMLParser._removeAttributeVariables(fragment);
        return {
          vertex:vertex,
          fragment:fragment,
          uniforms:uniforms
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

    private static _parseVariableAttributes(attributes:string):{[key:string]:string}
    {
      var result =<{[key:string]:string}>{};
      var commaSplitted = attributes.split(',');
      for(var i = 0; i < commaSplitted.length; i++)
      {
        var colonSplitted = commaSplitted[i].split(':');
        result[colonSplitted[0].trim()] = colonSplitted[1].trim();
      }
      return result;
    }

    private static _parseUniforms(source:string):IUniformVariableInfo[]
    {
      var result = [];
      var regex = /(?:\/\/@\((.+)\))?\s*uniform\s+([a-z0-9A-Z]+)\s+([a-zA-Z0-9_]+);/g;
      var regexResult;
      while((regexResult = regex.exec(source)))
      {
        result.push(<IUniformVariableInfo>{
          variableName:regexResult[3],
          variableType:regexResult[2],
          variableAnnotation: regexResult[1] ? this._parseVariableAttributes(regexResult[1]) : {}
        });
      }
      return result;
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

export = XMMLParser;
