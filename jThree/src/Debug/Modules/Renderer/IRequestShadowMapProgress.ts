import Q = require("q");
import Delegates = require("../../../Base/Delegates");
interface IRequestShadowMapProgress {
  deffered:Q.Deferred<HTMLImageElement>,
  rendererID:string,
  generator:Delegates.Func3<number,number,ArrayBufferView,Uint8Array>,
  begin:boolean
}

export = IRequestShadowMapProgress;
