import q from "q";
import {Func3} from "../../../Base/Delegates";
interface IRequestBufferTexture {
  deffered: q.Deferred<HTMLImageElement>;
  stageID: string;
  bufferTextureID: string;
  generator: Func3<number, number, ArrayBufferView, Uint8Array>;
}

export default IRequestBufferTexture;
