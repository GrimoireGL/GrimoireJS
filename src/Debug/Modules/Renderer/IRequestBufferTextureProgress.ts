import Q from "q";

interface IRequestBufferTextureProgress {
  deffered: Q.Deferred<HTMLImageElement>;
  stageID: string;
  bufferTextureID: string;
  generator: (w: number, h: number, source: ArrayBufferView) => Uint8Array;
  begin: boolean;
}
export default IRequestBufferTextureProgress;
