import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import JThreeContextProxy = require("../JThreeContextProxy");
import JThreeContext = require("../JThreeContext");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import Color4 = require("../../Base/Color/Color4");
import Color3 = require('../../Base/Color/Color3');
import TextureBase = require('../Resources/Texture/TextureBase');
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
declare function require(string): string;

class GBufferMaterial extends Material
{
    public get MaterialGroup(): string
    {
        return "jthree.materials.gbuffer";
    }

    private program: Program;

    constructor()
    {
        super();
        var vs = require('../Shaders/GBuffer/Vertex.glsl');
        var fs = require('../Shaders/GBuffer/PrimaryFragment.glsl');
        this.program = this.loadProgram("jthree.shaders.gbuffer.primary.vs", "jthree.shaders.gbuffer.primary.fs", "jthree.programs.gbuffer.primary", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo): void
    {
        if (!this.program) return;
        super.configureMaterial(scene, renderer, object, texs);
        var geometry = object.Geometry;
        var pw = this.program.getForContext(renderer.ContextManager);
        var v = object.Transformer.calculateMVPMatrix(renderer);
        pw.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer
            },
            uniforms: {
                matMVP: { type: "matrix", value: v },
                matMV: { type: "matrix", value: Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal) },
                specularCoefficient: {
                    type: "float",
                    value: 1.0 //TODO Should be changed           }
                }
            }
        });
        geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
    }

    private configurePrimaryBuffer() {
        
    }
}

export =GBufferMaterial;
