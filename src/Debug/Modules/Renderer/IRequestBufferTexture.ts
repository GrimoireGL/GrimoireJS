import q from "q";
interface IRequestBufferTexture {
  deffered: q.Deferred<HTMLImageElement>;
  stageID: string;
  bufferTextureID: string;
  generator: (w: number, h: number, source: ArrayBufferView) => Uint8Array;
}

export default IRequestBufferTexture;
