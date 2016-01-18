import Q = require("q");;
import Delegates = require("../../../Base/Delegates");
interface IRequestShadowMapTexture
{
  deffered:Q.Deferred<HTMLImageElement>,
  rendererID:string,
  generator:Delegates.Func3<number,number,ArrayBufferView,Uint8Array>
}
export = IRequestShadowMapTexture;
