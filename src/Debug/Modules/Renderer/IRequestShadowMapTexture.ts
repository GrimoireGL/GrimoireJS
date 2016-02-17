import Q from "q";
import {Func3} from "../../../Base/Delegates";
interface IRequestShadowMapTexture {
  deffered: Q.Deferred<HTMLImageElement>;
  rendererID: string;
  generator: Func3<number, number, ArrayBufferView, Uint8Array>;
}
export default IRequestShadowMapTexture;
