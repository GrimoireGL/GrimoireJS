
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
    console.log("queried");
    console.log(targetObject);
  });

}

j3("scene");
