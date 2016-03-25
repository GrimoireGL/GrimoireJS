import Q from "q";
interface IRequestShadowMapTexture {
  deffered: Q.Deferred<HTMLImageElement>;
  rendererID: string;
  generator: (w: number, h: number, source: ArrayBufferView) => Uint8Array;
}
export default IRequestShadowMapTexture;
