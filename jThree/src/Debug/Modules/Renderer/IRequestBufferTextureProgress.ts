import Q from "q";
import {Func3} from "../../../Base/Delegates";

interface IRequestBufferTextureProgress {
  deffered: Q.Deferred<HTMLImageElement>;
  stageID: string;
  bufferTextureID: string;
  generator: Func3<number, number, ArrayBufferView, Uint8Array>;
  begin: boolean;
}
export default IRequestBufferTextureProgress;
