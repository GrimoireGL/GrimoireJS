import Delegates = require("../Base/Delegates");
interface GomlNodeEventList
{
  [name:string]:Delegates.Action1<any>[];
}
export = GomlNodeEventList;
