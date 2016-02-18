import Q from "q";
import {Func3} from "../../../Base/Delegates";
interface IRequestShadowMapProgress {
  deffered: Q.Deferred<HTMLImageElement>;
  rendererID: string;
  generator: Func3<number, number, ArrayBufferView, Uint8Array>;
  begin: boolean;
}

export default IRequestShadowMapProgress;
