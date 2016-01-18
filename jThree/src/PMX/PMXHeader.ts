interface PMXHeader {
  version: number;
  headerByteSize: number;
  encoding: number;
  uvAddition: number;
  vertexIndexSize: number;
  textureIndexSize: number;
  materialIndexSize: number;
  boneIndexSize: number;
  morphIndexSize: number;
  rigidBodyIndexSize: number;
  modelName: string;
  modelNameEn: string;
  comment: string;
  commentEn: string;
}
export = PMXHeader;
