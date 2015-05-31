import $=require('jquery');
import Init = require("./Init");
import JThreeObject=require('./Base/JThreeObject');
import JThreeContextProxy = require("./Core/JThreeContextProxy");
import JThreeInterface = require("./JThreeInterface");
import Delegates = require("./Delegates");
declare function require(key:string):any;
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
function jqPrint(jq:JQuery) {
  for (var i = 0; i <jq.length; i++) {
      var target=jq[i];
      console.group();
      console.log(target);
      jqPrint($(target).children());
      console.log("</"+target.tagName.toLowerCase()+">");
  }
}
