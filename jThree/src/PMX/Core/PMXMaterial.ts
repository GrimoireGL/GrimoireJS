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
import PMXModel = require('./PMXModel');
import Delegates = require('../../Base/Delegates');
declare function require(string): string;

class PMXMaterialMorphParamContainer {
    constructor(calcFlag: number) {
        this.calcFlag = calcFlag;
        var def = 1 - calcFlag;
        this.diffuse = [def, def, def, def];
        this.specular = [def, def, def, def];
        this.ambient = [def, def, def];
        this.edgeColor = [def, def, def, def];
        this.edgeSize = def;
        this.textureCoeff = [def, def, def, def];
        this.sphereCoeff = [def, def, def, def];
        this.toonCoeff = [def, def, def, def];
    }

    private calcFlag: number;

    public diffuse: number[];

    public specular: number[];

    public ambient: number[];

    public edgeColor: number[];

    public edgeSize: number;

    public textureCoeff: number[];

    public sphereCoeff: number[];

    public toonCoeff: number[];

    public static calcMorphedSingleValue(base: number, add: PMXMaterialMorphParamContainer, mul: PMXMaterialMorphParamContainer, target: Delegates.Func1<PMXMaterialMorphParamContainer, number>) {
        return base * target(mul) + target(add);
    }

    public static calcMorphedVectorValue(base: Vector4|Vector3, add: PMXMaterialMorphParamContainer, mul: PMXMaterialMorphParamContainer, target: Delegates.Func1<PMXMaterialMorphParamContainer, number[]>, vecLength: number): Vector3|Vector4 {
        switch (vecLength) {
            case 3:
                return new Vector3(base.X * target(mul)[0] + target(add)[0],
                    base.Y * target(mul)[1] + target(add)[1],
                    base.Z * target(mul)[2] + target(add)[2]);
            case 4:
                return new Vector4(base.X * target(mul)[0] + target(add)[0],
                    base.Y * target(mul)[1] + target(add)[1],
                    base.Z * target(mul)[2] + target(add)[2],
                    (<Vector4>base).W * target(mul)[3] + target(add)[3]
                    );
        }
    }
}

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
    
    public get ParentModel()
    {
        return this.parentModel;
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

    private parentModel: PMXModel;

    private sphereMode: number;

    private materialIndex: number;

    public Name: string;

    public addMorphParam: PMXMaterialMorphParamContainer;

    public mulMorphParam: PMXMaterialMorphParamContainer;

    public get PassCount(): number {
        return this.edgeColor == null ? 1 : 2;
    }

    public get SelfShadow():boolean
    {
        return (this.pmxData.Materials[this.materialIndex].drawFlag & 0x04)>0;
    }

    constructor(pmx: PMXModel, index: number, offset: number, directory: string) {
        super();
        this.addMorphParam = new PMXMaterialMorphParamContainer(1);
        this.mulMorphParam = new PMXMaterialMorphParamContainer(0);
        this.parentModel = pmx;
        this.pmxData = pmx.ModelData;
        this.materialIndex = index;
        var materialData = this.pmxData.Materials[index];
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
        var geometry = <PMXGeometry>object.Geometry;
        var programWrapper = this.program.getForContext(renderer.ContextManager);
        programWrapper.useProgram();
        var v = object.Transformer.calculateMVPMatrix(renderer);
        programWrapper.registerTexture(renderer, texs["LIGHT"], 0, "u_light");
        programWrapper.registerTexture(renderer, this.texture, 1, "u_texture");
        programWrapper.registerTexture(renderer, this.toon, 2, "u_toon");
        programWrapper.registerTexture(renderer, this.sphere, 3, "u_sphere");
        programWrapper.registerTexture(renderer, this.parentModel.Skeleton.MatrixTexture, 4, "u_boneMatricies");
        programWrapper.setUniform1i("u_textureUsed", this.texture == null || this.texture.ImageSource == null ? 0 : 1);
        programWrapper.setUniform1i("u_sphereMode", this.sphere == null || this.sphere.ImageSource == null ? 0 : this.sphereMode);
        programWrapper.setUniform1i("u_toonFlag", this.toon == null || this.toon.ImageSource == null ? 0 : 1);
        programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("normal", geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("boneWeights", geometry.boneWeightBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("boneIndicies", geometry.boneIndexBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setUniformMatrix("matMVP", v);
        programWrapper.setUniformMatrix("matVP", Matrix.multiply(renderer.Camera.ProjectionMatrix, renderer.Camera.ViewMatrix));
        programWrapper.setUniformVector("u_ambient", PMXMaterialMorphParamContainer.calcMorphedVectorValue(this.ambient.toVector(), this.addMorphParam, this.mulMorphParam, (t) => t.ambient, 3));
        programWrapper.setUniformVector("u_diffuse", PMXMaterialMorphParamContainer.calcMorphedVectorValue(this.diffuse.toVector(), this.addMorphParam, this.mulMorphParam, (t) => t.diffuse, 4));
        programWrapper.setUniform1f("u_matIndex", this.materialIndex);
        programWrapper.setUniform1f("u_boneCount", this.parentModel.Skeleton.BoneCount);
        programWrapper.setUniformVector("u_addTexCoeff", new Vector4(this.addMorphParam.textureCoeff));
        programWrapper.setUniformVector("u_mulTexCoeff", new Vector4(this.mulMorphParam.textureCoeff));
        programWrapper.setUniformVector("u_addSphereCoeff", new Vector4(this.addMorphParam.sphereCoeff));
        programWrapper.setUniformVector("u_mulSphereCoeff", new Vector4(this.mulMorphParam.sphereCoeff));
        programWrapper.setUniformVector("u_addToonCoeff", new Vector4(this.addMorphParam.toonCoeff));
        programWrapper.setUniformVector("u_mulToonCoeff", new Vector4(this.mulMorphParam.toonCoeff));

        geometry.bindIndexBuffer(renderer.ContextManager);
    }

    private configureEdgeMaterial(renderer: RendererBase, object: SceneObject): void {
        if (!this.program) return;
        renderer.GLContext.Enable(GLFeatureType.CullFace);
        renderer.GLContext.CullFace(GLCullMode.Front);
        var id = renderer.ID;
        var geometry = <PMXGeometry> object.Geometry;
        var programWrapper = this.edgeProgram.getForContext(renderer.ContextManager);
        programWrapper.useProgram();
        programWrapper.registerTexture(renderer, this.parentModel.Skeleton.MatrixTexture, 0, "u_boneMatricies");
        programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("edgeScaling", geometry.edgeSizeBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setUniformMatrix("matVP", Matrix.multiply(renderer.Camera.ProjectionMatrix, renderer.Camera.ViewMatrix));
        programWrapper.setUniform1f("u_edgeSize", PMXMaterialMorphParamContainer.calcMorphedSingleValue(this.edgeSize, this.addMorphParam, this.mulMorphParam, (t) => t.edgeSize));
        programWrapper.setUniformVector("u_edgeColor", PMXMaterialMorphParamContainer.calcMorphedVectorValue(this.edgeColor.toVector(), this.addMorphParam, this.mulMorphParam, (t) => t.edgeColor, 4));
        programWrapper.setAttributeVerticies("boneWeights", geometry.boneWeightBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("boneIndicies", geometry.boneIndexBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setUniform1f("u_boneCount", this.parentModel.Skeleton.BoneCount);
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

    public getDrawGeometryLength(geo: Geometry): number {
        return this.diffuse.A>0?this.VerticiesCount:0;
    }

    public getDrawGeometryOffset(geo: Geometry): number {
        return this.VerticiesOffset*4;
    }
}

export =PMXMaterial;