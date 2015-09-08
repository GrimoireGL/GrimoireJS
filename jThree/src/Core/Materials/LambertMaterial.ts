import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import Color4 = require("../../Base/Color/Color4");
import Scene = require('../Scene');
import ResolvedChainInfo = require('../Renderers/ResolvedChainInfo');
declare function require(string): string;

class LambertMaterial extends Material
{
    private color: Color4 = Color4.parseColor('#F0F');

    public get Color(): Color4
    {
        return this.color;
    }

    public set Color(col: Color4)
    {
        this.color = col;
    }
    protected program: Program;
    constructor()
    {
        super();
        var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
        var fs = require('../Shaders/Lambert.glsl');
        this.program = this.loadProgram("jthree.shaders.vertex.basic", "jthree.shaders.fragment.lambert", "jthree.programs.lambert", vs, fs);
        this.setLoaded();
    }

    public configureMaterial(scene: Scene, renderer: RendererBase, object: SceneObject, texs: ResolvedChainInfo,techniqueIndex:number,passIndex:number): void
    {
        super.configureMaterial(scene, renderer, object, texs,techniqueIndex,passIndex);
        var geometry = object.Geometry;
        var v = object.Transformer.calculateMVPMatrix(renderer);
        var programWrapper = this.program.getForContext(renderer.ContextManager);
        programWrapper.register({
            attributes: {
                position: geometry.PositionBuffer,
                normal: geometry.NormalBuffer,
                uv: geometry.UVBuffer
            },
            uniforms: {
                matMVP: { type: "matrix", value: v },
                matV: { type: "matrix", value: renderer.Camera.ViewMatrix },
                matMV: { type: "matrix", value: Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal) },
                u_color: { type: "vector", value: this.Color.toVector() },
                u_DirectionalLight: { type: "vector", value: new Vector3(0, 0, -1) }
            }
        });
        geometry.IndexBuffer.getForContext(renderer.ContextManager).bindBuffer();
    }
}

export =LambertMaterial;
