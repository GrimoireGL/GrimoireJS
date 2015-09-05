import Material = require('../../Core/Materials/Material');
import Program = require("../../Core/Resources/Program/Program");
import JThreeContextProxy = require("../../Core/JThreeContextProxy");
import RendererBase = require("../../Core/Renderers/RendererBase");
import Geometry = require("../../Core/Geometries/Geometry");
import SceneObject = require("../../Core/SceneObject");
import Vector4 = require('../../Math/Vector4');
import Matrix = require("../../Math/Matrix");
import Color4 = require("../../Base/Color/Color4");
import Color3 = require('../../Base/Color/Color3');
import GLCullMode = require("../../Wrapper/GLCullMode");
import GLFeatureType = require("../../Wrapper/GLFeatureType");
import Scene = require('../../Core/Scene');
import ResolvedChainInfo = require('../../Core/Renderers/ResolvedChainInfo');
import PMX = require('../PMXLoader');
import Texture = require('../../Core/Resources/Texture/Texture');
import BlendFuncParamType = require("../../Wrapper/BlendFuncParamType");
import PMXGeometry = require('./PMXGeometry');
import PMXModel = require('./PMXModel');
import PmxMaterialMorphParamContainer = require('./PMXMaterialMorphParamContainer');

declare function require(string): string;


/**
 * the materials for PMX.
 */
class PMXMaterial extends Material
{
    protected program: Program;

    protected edgeProgram: Program;

    private verticiesCount;

    private verticiesOffset;

    /**
     * Count of verticies
     */
    public get VerticiesCount()
    {
        return this.verticiesCount;
    }

    /**
     * Offset of verticies in index buffer
     */
    public get VerticiesOffset()
    {
        return this.verticiesOffset;
    }

    public get ParentModel()
    {
        return this.parentModel;
    }

    public get Diffuse(): Color4
    {
        return this.diffuse;
    }

    public get Texture()
    {
        return this.texture;
    }

    public get Sphere()
    {
        return this.sphere;
    }


    public get SphereMode()
    {
        return this.sphereMode;
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

    public addMorphParam: PmxMaterialMorphParamContainer;

    public mulMorphParam: PmxMaterialMorphParamContainer;

    private textureCaches: HTMLImageElement[] = [];

    public get PassCount(): number
    {
        return this.edgeColor == null ? 1 : 2;
    }

    public get SelfShadow(): boolean
    {
        return (this.pmxData.Materials[this.materialIndex].drawFlag & 0x04) > 0;
    }

    constructor(pmx: PMXModel, index: number, offset: number, directory: string)
    {
        super();
        this.addMorphParam = new PmxMaterialMorphParamContainer(1);
        this.mulMorphParam = new PmxMaterialMorphParamContainer(0);
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
        if (materialData.sharedToonFlag == 0)
        {// not shared texture
            this.toon = this.loadPMXTexture(materialData.targetToonIndex, "toon", directory);
        }
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo, pass?: number): void
    {
        if (pass == 1)
        {
            this.configureEdgeMaterial(renderer, object);
            return;
        }
        if (!this.program) return;
        super.configureMaterial(scene, renderer, object, texs);
        renderer.GLContext.BlendFunc(BlendFuncParamType.SrcAlpha, BlendFuncParamType.OneMinusSrcAlpha);
        var geometry = <PMXGeometry>object.Geometry;
        var programWrapper = this.program.getForContext(renderer.ContextManager);
        var v = object.Transformer.calculateMVPMatrix(renderer);
        programWrapper.register(
            {
                attributes: {
                    position: geometry.PositionBuffer,
                    normal: geometry.NormalBuffer,
                    uv: geometry.UVBuffer,
                    boneWeights: geometry.boneWeightBuffer,
                    boneIndicies: geometry.boneIndexBuffer
                },
                uniforms: {
                    u_light: {
                        type: "texture",
                        value: texs["LIGHT"],
                        register: 0
                    },
                    u_texture: {
                        type: "texture",
                        value: this.texture,
                        register: 1
                    },
                    u_toon: {
                        type: "texture",
                        value: this.toon,
                        register: 2
                    },
                    u_sphere: {
                        type: "texture",
                        value: this.sphere,
                        register: 3
                    },
                    u_boneMatricies: {
                        type: "texture",
                        value: this.parentModel.Skeleton.MatrixTexture,
                        register: 4
                    },
                    u_textureUsed: {
                        type: "integer",
                        value: this.texture == null || this.texture.ImageSource == null ? 0 : 1
                    },
                    u_sphereMode: {
                        type: "integer",
                        value: this.sphere == null || this.sphere.ImageSource == null ? 0 : this.sphereMode
                    },
                    u_toonFlag: {
                        type: "integer",
                        value: this.toon == null || this.toon.ImageSource == null ? 0 : 1
                    },
                    u_ambient: {
                        type: "vector",
                        value: PmxMaterialMorphParamContainer.calcMorphedVectorValue(this.ambient.toVector(), this.addMorphParam, this.mulMorphParam, (t) => t.ambient, 3)
                    },
                    u_diffuse: {
                        type: "vector",
                        value: PmxMaterialMorphParamContainer.calcMorphedVectorValue(this.diffuse.toVector(), this.addMorphParam, this.mulMorphParam, (t) => t.diffuse, 4)
                    },
                    u_addTexCoeff: { type: "vector", value: new Vector4(this.addMorphParam.textureCoeff) },
                    u_mulTexCoeff: { type: "vector", value: new Vector4(this.mulMorphParam.textureCoeff) },
                    u_addSphereCoeff: { type: "vector", value: new Vector4(this.addMorphParam.sphereCoeff) },
                    u_mulSphereCoeff: { type: "vector", value: new Vector4(this.mulMorphParam.sphereCoeff) },
                    u_addToonCoeff: { type: "vector", value: new Vector4(this.addMorphParam.toonCoeff) },
                    u_mulToonCoeff: { type: "vector", value: new Vector4(this.mulMorphParam.toonCoeff) },
                    matMVP: { type: "matrix", value: v },
                    matVP: { type: "matrix", value: Matrix.multiply(renderer.Camera.ProjectionMatrix, renderer.Camera.ViewMatrix) },
                    u_boneCount: {
                        type: "float",
                        value: this.parentModel.Skeleton.BoneCount
                    }
                }
            });
        geometry.bindIndexBuffer(renderer.ContextManager);
    }

    private configureEdgeMaterial(renderer: RendererBase, object: SceneObject): void
    {
        if (!this.program) return;
        renderer.GLContext.Enable(GLFeatureType.CullFace);
        renderer.GLContext.CullFace(GLCullMode.Front);
        var geometry = <PMXGeometry> object.Geometry;
        var programWrapper = this.edgeProgram.getForContext(renderer.ContextManager);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                edgeScaling: geometry.edgeSizeBuffer,
                boneWeights: geometry.boneWeightBuffer,
                boneIndicies: geometry.boneIndexBuffer
            },
            uniforms: {
                u_boneMatricies: {
                    type: "texture", register: 0, value: this.ParentModel.Skeleton.MatrixTexture
                },
                matVP: {
                    type: "matrix", value: Matrix.multiply(renderer.Camera.ProjectionMatrix, renderer.Camera.ViewMatrix)
                },
                u_edgeSize: {
                    type: "float", value: PmxMaterialMorphParamContainer.calcMorphedSingleValue(this.edgeSize, this.addMorphParam, this.mulMorphParam, (t) => t.edgeSize)
                },
                u_edgeColor: {
                    type: "vector", value: PmxMaterialMorphParamContainer.calcMorphedVectorValue(
                        this.edgeColor.toVector(), this.addMorphParam, this.mulMorphParam, (t) => t.edgeColor, 4)
                }
                ,
                u_boneCount: {
                    type: "float", value: this.parentModel.Skeleton.BoneCount
                }
            }
        });
        geometry.bindIndexBuffer(renderer.ContextManager);
    }

    private loadPMXTexture(index: number, prefix: string, directory: string): Texture
    {
        if (index < 0) return null;
        var rm = JThreeContextProxy.getJThreeContext().ResourceManager;
        var resourceName = "jthree.pmx." + prefix + "." + index;
        if (rm.getTexture(resourceName))
        {
            return rm.getTexture(resourceName);
        } else
        {
            var texture = rm.createTextureWithSource(resourceName, null);
            this.loadImage(directory + this.pmxData.Textures[index]).then((t) =>
            {
                texture.ImageSource = t;
            });
            return texture;
        }
    }

    private loadImage(src: string): Q.Promise<HTMLImageElement>
    {
        return Q.Promise<HTMLImageElement>((resolver, reject, notify) =>
        {
            var img = new Image();
            this.textureCaches.push(img);
            img.onload = () =>
            {
                resolver(img);
            }
            img.src = src;
        }
            );
    }

    public get Priorty(): number
    {
        return 100 + this.materialIndex;
    }

    public getDrawGeometryLength(geo: Geometry): number
    {
        return this.diffuse.A > 0 ? this.VerticiesCount : 0;
    }

    public getDrawGeometryOffset(geo: Geometry): number
    {
        return this.VerticiesOffset * 4;
    }
}

export =PMXMaterial;
