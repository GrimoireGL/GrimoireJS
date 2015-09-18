import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Matrix = require("../../Math/Matrix");
import TextureBase = require('../Resources/Texture/TextureBase');
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
declare function require(string): string;

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
        var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
        var fs = require('../Shaders/Sprite.glsl');
        this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.sprite", "jthree.programs.sprite", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo,techniqueIndex:number,passIndex:number): void
    {
        super.configureMaterial(scene, renderer, object, texs,techniqueIndex,passIndex);
        var geometry = object.Geometry;
        var programWrapper = this.program.getForContext(renderer.ContextManager);
        var v = object.Transformer.calculateMVPMatrix(renderer);
        //gen ct matrix
        var ctM: Matrix = Matrix.zero();
        if (this.ctR < 4) ctM.setAt(this.ctR, 0, 1);
        if (this.ctG < 4) ctM.setAt(this.ctG, 1, 1);
        if (this.ctB < 4) ctM.setAt(this.ctB, 2, 1);
        if (this.ctA < 4) ctM.setAt(this.ctA, 3, 1);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer,
                uv: geometry.UVBuffer
            }, uniforms: {
                matMVP: { type: "matrix", value: v },
                matV: { type: "matrix", value: renderer.Camera.ViewMatrix },
                matMV: { type: "matrix", value: Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal) },
                u_sampler: { type: "texture", register: 0, value: this.texture },
                additionA: { type: "integer", value: this.ctA < 4 ? 0 : 1 },
                ctM: { type: "matrix", value: ctM }
            }
        });
        geometry.bindIndexBuffer(renderer.ContextManager);
    }
}

export =SpriteMaterial;
