import BasicMaterial = require("../../../Core/Materials/Base/BasicMaterial");
import Material = require('../../../Core/Materials/Material');
import Program = require("../../../Core/Resources/Program/Program");
import BasicRenderer = require("../../../Core/Renderers/BasicRenderer");
import Geometry = require("../../../Core/Geometries/Geometry");
import SceneObject = require("../../../Core/SceneObject");
import Vector4 = require('../../../Math/Vector4');
import Matrix = require("../../../Math/Matrix");
import Color4 = require("../../../Base/Color/Color4");
import Color3 = require('../../../Base/Color/Color3');
import GLCullMode = require("../../../Wrapper/GLCullMode");
import GLFeatureType = require("../../../Wrapper/GLFeatureType");
import Scene = require('../../../Core/Scene');
import ResolvedChainInfo = require('../../../Core/Renderers/ResolvedChainInfo');
import PMX = require('../../PMXLoader');
import Texture = require('../../../Core/Resources/Texture/Texture');
import BlendFuncParamType = require("../../../Wrapper/BlendFuncParamType");
import PMXGeometry = require('./../PMXGeometry');
import PMXModel = require('./../PMXModel');
import PmxMaterialMorphParamContainer = require('./../PMXMaterialMorphParamContainer');
import JThreeLogger = require("../../../Base/JThreeLogger");
import ResourceManager = require("../../../Core/ResourceManager");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import IMaterialConfig = require("../../../Core/Materials/IMaterialConfig");
import RenderStageBase = require("../../../Core/Renderers/RenderStages/RenderStageBase");

/**
 * the materials for PMX.
 */
class PMXMaterial extends Material
{
    protected edgeProgram: Program;

    protected __innerMaterial:BasicMaterial;

    private verticiesCount;

    private verticiesOffset;

    public  getMaterialConfig(pass:number,technique:number):IMaterialConfig
    {
      if(pass == 0)
      {
        return {
          cull:this.cullEnabled ? "ccw" : undefined,
          blend:true
        }
      }else
      {
        return {
          cull:"cw"
        }
      }
    }

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

    public get Specular() {
        return this.specular;
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

    public materialIndex: number;

    public cullEnabled:boolean;

    private specular:Vector4;

    public Name: string;

    public addMorphParam: PmxMaterialMorphParamContainer;

    public mulMorphParam: PmxMaterialMorphParamContainer;

    private textureCaches: HTMLImageElement[] = [];

    public getPassCount(techniqueIndex:number): number
    {
        return 1;
    }

    public get SelfShadow(): boolean
    {
        return (this.pmxData.Materials[this.materialIndex].drawFlag & 0x04) > 0;
    }

    constructor(pmx: PMXModel, index: number, offset: number)
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
        this.cullEnabled = !((materialData.drawFlag & 0x01) > 0);//each side draw flag
        this.ambient = new Color3(materialData.ambient[0], materialData.ambient[1], materialData.ambient[2]);
        this.diffuse = new Color4(materialData.diffuse[0], materialData.diffuse[1], materialData.diffuse[2], materialData.diffuse[3]);
        if ((materialData.drawFlag & 0x10) > 0) this.edgeColor = new Color4(materialData.edgeColor[0], materialData.edgeColor[1], materialData.edgeColor[2], materialData.edgeColor[3]);
        this.specular = new Vector4(materialData.specular);
        this.edgeSize = materialData.edgeSize;
        this.sphereMode = materialData.sphereMode;
        this.__innerMaterial = new BasicMaterial(require("../../Materials/Forward.html"));
        var vs = require('../../Shader/PMXEdgeVertex.glsl');
        var fs = require('../../Shader/PMXEdgeFragment.glsl');
        this.edgeProgram = this.loadProgram("jthree.shaders.vertex.pmx.edge", "jthree.shaders.fragment.pmx.edge", "jthree.programs.pmx.edge", vs, fs);
        this.sphere = this.loadPMXTexture(materialData.sphereTextureIndex, "sphere");
        this.texture = this.loadPMXTexture(materialData.textureIndex, "texture");
        if (materialData.sharedToonFlag == 0)
        {// not shared texture
            this.toon = this.loadPMXTexture(materialData.targetToonIndex, "toon");
        }else{
          //TODO use shared toon textures
        }
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderStage: RenderStageBase, object: SceneObject, texs: ResolvedChainInfo, techniqueIndex:number,passIndex:number): void
    {
      var renderer = renderStage.Renderer;
      const skeleton = this.parentModel.skeleton;
      //super.configureMaterial(scene, renderStage, object, texs,techniqueIndex,passIndex);
        if (passIndex == 1)
        {
            this.configureEdgeMaterial(renderer, object);
            return;
        }
        this.__innerMaterial.materialVariables = {
            boneCount:skeleton.BoneCount,
            boneMatriciesTexture:skeleton.MatrixTexture,
            texture: this.texture,
            toon: this.toon,
            sphere: this.sphere,
            diffuse: this.diffuse.toVector(),
            specular: this.specular,
            ambient: this.ambient.toVector(),
            textureUsed: this.texture == null || this.texture.ImageSource == null ? 0 : 1,
            sphereMode: this.sphere == null || this.sphere.ImageSource == null ? 0 : this.sphereMode,
            toonFlag: this.toon == null || this.toon.ImageSource == null ? 0 : 1,
            addTexCoeff:new Vector4(this.addMorphParam.textureCoeff) ,
            mulTexCoeff:new Vector4(this.mulMorphParam.textureCoeff) ,
            addSphereCoeff:new Vector4(this.addMorphParam.sphereCoeff),
            mulSphereCoeff:new Vector4(this.mulMorphParam.sphereCoeff),
            addToonCoeff:new Vector4(this.addMorphParam.toonCoeff) ,
            mulToonCoeff:new Vector4(this.mulMorphParam.toonCoeff) ,
        };
        this.__innerMaterial.configureMaterial(scene,renderStage,object,texs,techniqueIndex,passIndex);
    }

    private configureEdgeMaterial(renderer: BasicRenderer, object: SceneObject): void
    {
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
                    type: "texture", register: 0, value: this.ParentModel.skeleton.MatrixTexture
                },
                matVP: {
                    type: "matrix", value: renderer.Camera.viewProjectionMatrix
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
                    type: "float", value: this.parentModel.skeleton.BoneCount
                }
            }
        });
        geometry.bindIndexBuffer(renderer.ContextManager);
    }

    private loadPMXTexture(index: number, prefix: string): Texture
    {
        if (index < 0) return null;
        var rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
        var resourceName = this.pmxData.Header.modelName+"jthree.pmx." + prefix + "." + index;
        if (rm.getTexture(resourceName))
        {
            return rm.getTexture(resourceName);
        } else
        {
            var texture = rm.createTextureWithSource(resourceName, null);
            this.loadImage(index).then((t) =>
            {
                texture.ImageSource = t;
            });
            return texture;
        }
    }

    private loadImage(index:number): Q.Promise<HTMLImageElement>
    {
        return this.parentModel.pmxTextureManager.loadTexture(index);
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
