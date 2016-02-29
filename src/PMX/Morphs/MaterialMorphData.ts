
interface MaterialMorphData {
  materialIndex: number;
  operationType: number;
  diffuse: number[];
  specular: number[];
  ambient: number[];
  edgeColor: number[];
  edgeSize: number;
  textureCoefficient: number[];
  sphereTextureCoefficient: number[];
  toonTextureCoefficient: number[];
}

export default MaterialMorphData;
