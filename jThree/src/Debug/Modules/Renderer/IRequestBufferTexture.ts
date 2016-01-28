import q = require("q")
import Delegates = require("../../../Base/Delegates");
interface IRequestBufferTexture {
  deffered: q.Deferred<HTMLImageElement>;
  stageID: string;
  bufferTextureID: string;
  generator: Delegates.Func3<number, number, ArrayBufferView, Uint8Array>;
}

export = IRequestBufferTexture;
