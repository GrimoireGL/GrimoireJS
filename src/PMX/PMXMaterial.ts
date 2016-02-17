interface PMXMaterial {
  materialName: string;
  materialNameEn: string;
  diffuse: number[];
  specular: number[];
  ambient: number[];
  drawFlag: number;
  edgeColor: number[];
  edgeSize: number;
  textureIndex: number;
  sphereTextureIndex: number;
  sphereMode: number;
  sharedToonFlag: number;
  targetToonIndex: number;
  memo: string;
  vertexCount: number;
}
export default PMXMaterial;
