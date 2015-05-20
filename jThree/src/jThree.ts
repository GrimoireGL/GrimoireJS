
import $=require('jquery');
import Init = require("./Init");
import JThreeObject=require('./Base/JThreeObject');
import JThreeContextProxy = require("./Core/JThreeContextProxy");
var noInit: boolean;
if (!String.prototype["format"]) {
    String.prototype["format"] = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, num) {
            if (typeof args[num] != 'undefined') {
                return args[num];
            } else {
                return match;
            }
        });
    };
}
Init.Init();
function j3(query:string)
{
  var context=JThreeContextProxy.getJThreeContext();
  context.GomlLoader.onload(()=>{
    var targetObject=context.GomlLoader.rootObj.find(query);
    jqPrint(context.GomlLoader.rootObj);
    for (var i = 0; i < targetObject.length; i++) {
        var target=targetObject[i];
        console.log(target);
    }
  });

}

function jqPrint(jq:JQuery) {
  for (var i = 0; i <jq.length; i++) {
      var target=jq[i];
      console.group();
      console.log(target);
      jqPrint($(target).children());
      console.log("</"+target.tagName.toLowerCase()+">");
      console.groupEnd();
  }
}
j3("scene");
