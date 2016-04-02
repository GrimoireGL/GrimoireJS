interface WebGLRenderingContext {
  id: string;
  texImage2D(target: number, level: number, elementLayout: number, width: number, height: number, border: number, format: number, type: number, pixels?: ArrayBufferView);
}

declare var jDataView: {
  new (buffer: ArrayBuffer, offset: number, length: number, littleEndian): JDataView;
};

interface JDataView {
  getString(length: Number, offset?: number, encoding?: string): string;
  getInt8(offset?: number, littleEndian?: boolean): number;
  getUint8(offset?: number, littleEndian?: boolean): number;
  getInt16(offset?: number, littleEndian?: boolean): number;
  getUint16(offset?: number, littleEndian?: boolean): number;
  getInt32(offset?: number, littleEndian?: boolean): number;
  getUint32(offset?: number, littleEndian?: boolean): number;
  getUint32(offset?: number, littleEndian?: boolean): number;
  getFloat32(offset?: number, littleEndian?: boolean): number;
  getFloat64(offset?: number, littleEndian?: boolean): number;
  slice(start: number, end: number, forceCopy?: boolean);
  skip(byteLength: number);
  tell(): number;
}

declare var TextDecoder: {
  new (encoding: string): TextDecoder;
  prototype: TextDecoder;
};
interface TextDecoder {
  decode(buf: Uint8Array);
}

declare var WebGLVertexArrayObject: {
  prototype: WebGLVertexArrayObject;
  new (): WebGLVertexArrayObject;
};
interface WebGLVertexArrayObjectExtension {
  createVertexArrayOES();
  bindVertexArrayOES(vao: WebGLVertexArrayObject);
  deleteVertexArrayOES(vao: WebGLVertexArrayObject);
}
interface WebGLVertexArrayObject extends WebGLObject {
}
