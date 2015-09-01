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
    private texture: TextureBase;

    public get Texture(): TextureBase
    {
        return this.texture;
    }

    public set Texture(tex: TextureBase)
    {
        this.texture = tex;
    }

    private ctR: number = 0;
    private ctG: number = 1;
    private ctB: number = 2;
    private ctA: number = 3;
    public get CTR(): number
    {
        return this.ctR;
    }

    public set CTR(ctr: number)
    {
        this.ctR = ctr;
    }

    public get CTG(): number
    {
        return this.ctG;
    }

    public set CTG(ctg: number)
    {
        this.ctG = ctg;
    }

    public get CTB(): number
    {
        return this.ctB;
    }

    public set CTB(ctb: number)
    {
        this.ctB = ctb;
    }

    public get CTA(): number
    {
        return this.ctA;
    }

    public set CTA(cta: number)
    {
        this.ctA = cta;
    }


    protected program: Program;
    constructor()
    {
        super();
        var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
        var fs = require('../Shaders/Sprite.glsl');
        this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.sprite", "jthree.programs.sprite", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo): void
    {
        super.configureMaterial(scene, renderer, object, texs);
        var geometry = object.Geometry;
        var programWrapper = this.program.getForContext(renderer.ContextManager);
        var v = object.Transformer.calculateMVPMatrix(renderer);
        //gen ct matrix
        var ctM: Matrix = Matrix.zero();
        if (this.CTR < 4) ctM.setAt(this.CTR, 0, 1);
        if (this.CTG < 4) ctM.setAt(this.CTG, 1, 1);
        if (this.CTB < 4) ctM.setAt(this.CTB, 2, 1);
        if (this.CTA < 4) ctM.setAt(this.CTA, 3, 1);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer,
                uv: geometry.UVBuffer
            }, uniforms: {
                matMVP: { type: "matrix", value: v },
                matV: { type: "matrix", value: renderer.Camera.ViewMatrix },
                matMV: { type: "matrix", value: Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal) },
                u_sampler: { type: "texture", register: 0, value: this.Texture },
                additionA: { type: "integer", value: this.CTA < 4 ? 0 : 1 },
                ctM: { type: "matrix", value: ctM }
            }
        });
        geometry.bindIndexBuffer(renderer.ContextManager);
    }
}

export =SpriteMaterial;
