import Q from "q";
interface IRequestShadowMapProgress {
  deffered: Q.Deferred<HTMLImageElement>;
  rendererID: string;
  generator: (w: number, h: number, source: ArrayBufferView) => Uint8Array;
  begin: boolean;
}

export default IRequestShadowMapProgress;
