import Material = require('../../Core/Materials/Material');
import Program = require("../../Core/Resources/Program/Program");
import JThreeContextProxy = require("../../Core/JThreeContextProxy");
import JThreeContext = require("../../Core/JThreeContext");
import Shader = require("../../Core/Resources/Shader/Shader");
import ShaderType = require("../../Wrapper/ShaderType");
import RendererBase = require("../../Core/Renderers/RendererBase");
import Geometry = require("../../Core/Geometries/Geometry");
import SceneObject = require("../../Core/SceneObject");
import Vector3 = require("../../Math/Vector3");
import Vector4 = require('../../Math/Vector4');
import Matrix = require("../../Math/Matrix");
import PrimitiveTopology = require("../../Wrapper/PrimitiveTopology");
import Quaternion = require("../../Math/Quaternion");
import Color4 = require("../../Base/Color/Color4");
import Color3 = require('../../Base/Color/Color3');
import GLCullMode = require("../../Wrapper/GLCullMode");
import GLFeatureType = require("../../Wrapper/GLFeatureType");
import TextureRegister = require('../../Wrapper/Texture/TextureRegister');
import TextureBase = require('../../Core/Resources/Texture/TextureBase');
import Scene = require('../../Core/Scene');
import TargetTextureType = require('../../Wrapper/TargetTextureType');
import agent = require('superagent');
import ResolvedChainInfo = require('../../Core/Renderers/ResolvedChainInfo');
import PMXMaterialData = require('../PMXMaterial');
import PMX = require('../PMXLoader');
import Texture = require('../../Core/Resources/Texture/Texture');
import BlendFuncParamType = require("../../Wrapper/BlendFuncParamType");
import PMXGeometry = require('./PMXGeometry');
declare function require(string): string;

/**
 * the materials for PMX.
 */
class PMXMaterial extends Material {
  protected program: Program;

  protected edgeProgram: Program;

  private verticiesCount;

  private verticiesOffset;
    
  /**
   * Count of verticies
   */
  public get VerticiesCount() {
    return this.verticiesCount;
  }
    
  /**
   * Offset of verticies in index buffer
   */
  public get VerticiesOffset() {
    return this.verticiesOffset;
  }

  public get Diffuse(): Color4 {
    return this.diffuse;
  }

  private ambient: Color3;

  private diffuse: Color4;

  public edgeColor: Color4 = null;

  private edgeSize: number;

  private sphere: Texture = null;

  private texture: Texture = null;

  private toon: Texture = null;

  private pmxData: PMX;

  private sphereMode: number;

  private materialIndex: number;

  public Name: string;

  public get PassCount(): number {
    return this.edgeColor == null ? 1 : 2;
  }

  constructor(pmx: PMX, index: number, offset: number, directory: string) {
    super();
    this.pmxData = pmx;
    this.materialIndex = index;
    var materialData = pmx.Materials[index];
    this.verticiesCount = materialData.vertexCount;
    this.verticiesOffset = offset;
    this.Name = materialData.materialName;
    this.CullEnabled = !((materialData.drawFlag & 0x01) > 0);//each side draw flag
    this.ambient = new Color3(materialData.ambient[0], materialData.ambient[1], materialData.ambient[2]);
    this.diffuse = new Color4(materialData.diffuse[0], materialData.diffuse[1], materialData.diffuse[2], materialData.diffuse[3]);
    if ((materialData.drawFlag & 0x10) > 0) this.edgeColor = new Color4(materialData.edgeColor[0], materialData.edgeColor[1], materialData.edgeColor[2], materialData.edgeColor[3]);
    this.edgeSize = materialData.edgeSize;
    this.sphereMode = materialData.sphereMode;
    var vs = require('../Shader/PMXVertex.glsl');
    var fs = require('../Shader/PMXFragment.glsl');
    this.program = this.loadProgram("jthree.shaders.vertex.pmx.basic", "jthree.shaders.fragment.pmx.basic", "jthree.programs.pmx.basic", vs, fs);
    var vs = require('../Shader/PMXEdgeVertex.glsl');
    var fs = require('../Shader/PMXEdgeFragment.glsl');
    this.edgeProgram = this.loadProgram("jthree.shaders.vertex.pmx.edge", "jthree.shaders.fragment.pmx.edge", "jthree.programs.pmx.edge", vs, fs);
    this.sphere = this.loadPMXTexture(materialData.sphereTextureIndex, "sphere", directory);
    this.texture = this.loadPMXTexture(materialData.textureIndex, "texture", directory);
    if (materialData.sharedToonFlag == 0) {// not shared texture
      this.toon = this.loadPMXTexture(materialData.targetToonIndex, "toon", directory);
    }
    this.setLoaded();
  }

  configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo, pass?: number): void {
    if (pass == 1) {
      this.configureEdgeMaterial(renderer, object);
      return;
    }
    if (!this.program) return;
    super.configureMaterial(scene, renderer, object, texs);
    renderer.GLContext.Enable(GLFeatureType.DepthTest);
    renderer.GLContext.Enable(GLFeatureType.Blend);
    renderer.GLContext.BlendFunc(BlendFuncParamType.SrcAlpha, BlendFuncParamType.OneMinusSrcAlpha);
    var id = renderer.ID;
    var geometry = object.Geometry;
    var programWrapper = this.program.getForContext(renderer.ContextManager);
    programWrapper.useProgram();
    var v = object.Transformer.calculateMVPMatrix(renderer);
    programWrapper.registerTexture(renderer, texs["LIGHT"], 0, "u_light");
    programWrapper.registerTexture(renderer, this.texture, 1, "u_texture");
    programWrapper.registerTexture(renderer, this.toon, 2, "u_toon");
    programWrapper.registerTexture(renderer, this.sphere, 3, "u_sphere");
    programWrapper.setUniform1i("u_textureUsed", this.texture == null || this.texture.ImageSource == null ? 0 : 1);
    programWrapper.setUniform1i("u_sphereMode", this.sphere == null || this.sphere.ImageSource == null ? 0 : this.sphereMode);
    programWrapper.setUniform1i("u_toonFlag", this.toon == null || this.toon.ImageSource == null ? 0 : 1);
    programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setAttributeVerticies("normal", geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setUniformMatrix("matMVP", v);
    programWrapper.setUniformVector("u_ambient", this.ambient.toVector());
    programWrapper.setUniformVector("u_diffuse", this.diffuse.toVector());
    programWrapper.setUniform1f("u_matIndex", this.materialIndex);
    programWrapper.setUniform1f("xtest", <number>new Number((<HTMLInputElement>document.getElementsByName("x").item(0)).value));
    geometry.bindIndexBuffer(renderer.ContextManager);
  }

    configureEdgeMaterial(renderer: RendererBase, object: SceneObject): void {
    if (!this.program) return;
    renderer.GLContext.Enable(GLFeatureType.CullFace);
    renderer.GLContext.CullFace(GLCullMode.Front);
    var id = renderer.ID;
    var geometry =<PMXGeometry> object.Geometry;
    var programWrapper = this.edgeProgram.getForContext(renderer.ContextManager);
    programWrapper.useProgram();
    var v = object.Transformer.calculateMVPMatrix(renderer);
    programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("edgeScaling", geometry.edgeSizeBuffer.getForRenderer(renderer.ContextManager));
    programWrapper.setUniformMatrix("matMVP", v);
    programWrapper.setUniform1f("u_edgeSize", this.edgeSize);
    programWrapper.setUniformVector("u_edgeColor", this.edgeColor.toVector());
    geometry.bindIndexBuffer(renderer.ContextManager);
  }

  private loadPMXTexture(index: number, prefix: string, directory: string): Texture {
    if (index < 0) return null;
    var rm = JThreeContextProxy.getJThreeContext().ResourceManager;
    var resourceName = "jthree.pmx." + prefix + "." + index;
    if (rm.getTexture(resourceName)) {
      return rm.getTexture(resourceName);
    } else {
      var texture = rm.createTextureWithSource(resourceName, null);
      var img = new Image();
      img.onload = () => {
        texture.ImageSource = img;
      };
      img.src = directory + this.pmxData.Textures[index];
      return texture;
    }
  }

  public get Priorty(): number {
    return 100 + this.materialIndex;
  }
}

export =PMXMaterial;