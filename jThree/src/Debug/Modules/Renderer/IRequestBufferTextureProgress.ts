import Q = require('q');
import Delegates = require("../../../Base/Delegates");

interface IRequestBufferTextureProgress
{
  deffered:Q.Deferred<HTMLImageElement>,
  stageID:string,
  bufferTextureID:string,
  generator:Delegates.Func3<number,number,ArrayBufferView,Uint8Array>,
  begin:boolean
}
export = IRequestBufferTextureProgress;
