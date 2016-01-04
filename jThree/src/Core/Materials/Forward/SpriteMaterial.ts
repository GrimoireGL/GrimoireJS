import Material = require("./../Material");
import Program = require("../../Resources/Program/Program");
import BasicRenderer = require("../../Renderers/BasicRenderer");
import SceneObject = require("../../SceneObject");
import Matrix = require("../../../Math/Matrix");
import TextureBase = require('../../Resources/Texture/TextureBase');
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../../Renderers/ResolvedChainInfo');
import RenderStageBase = require("../../Renderers/RenderStages/RenderStageBase");

class SpriteMaterial extends Material
{
    public texture: TextureBase;
    public ctR: number = 0;
    public ctG: number = 1;
    public ctB: number = 2;
    public ctA: number = 3;

    protected program: Program;
    constructor()
    {
        super();
        var vs = require('../../Shaders/VertexShaders/BasicGeometries.glsl');
        var fs = require('../../Shaders/Sprite.glsl');
        this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.sprite", "jthree.programs.sprite", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderStage: RenderStageBase, object: SceneObject, texs: ResolvedChainInfo,techniqueIndex:number,passIndex:number): void
    {
        var renderer = renderStage.Renderer;
        super.configureMaterial(scene, renderStage, object, texs,techniqueIndex,passIndex);
        var geometry = object.Geometry;
        var programWrapper = this.program.getForContext(renderer.ContextManager);
        var v = object.Transformer.calculateMVPMatrix(renderer);
        //gen ct matrix
        var ctM: Matrix = Matrix.zero();
        if (this.ctR < 4) ctM.setAt(0,this.ctR, 1);
        if (this.ctG < 4) ctM.setAt(1,this.ctG, 1);
        if (this.ctB < 4) ctM.setAt(2,this.ctB, 1);
        if (this.ctA < 4) ctM.setAt(3,this.ctA, 1);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer,
                uv: geometry.UVBuffer
            }, uniforms: {
                matMVP: { type: "matrix", value: v },
                matV: { type: "matrix", value: renderer.Camera.viewMatrix },
                matMV: { type: "matrix", value: Matrix.multiply(renderer.Camera.viewMatrix, object.Transformer.LocalToGlobal) },
                u_sampler: { type: "texture", register: 0, value: this.texture },
                additionA: { type: "integer", value: this.ctA < 4 ? 0 : 1 },
                ctM: { type: "matrix", value: ctM }
            }
        });
        geometry.bindIndexBuffer(renderer.ContextManager);
    }
}

export =SpriteMaterial;
