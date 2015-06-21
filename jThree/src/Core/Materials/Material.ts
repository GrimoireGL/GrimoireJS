import JThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Matrix = require("../../Math/Matrix");
import GLCullMode = require("../../Wrapper/GLCullMode");
import GLFeatureType = require("../../Wrapper/GLFeatureType");
import JThreeContextProxy = require('./../JThreeContextProxy');
import ShaderType = require("../../Wrapper/ShaderType");
import Program = require('../Resources/Program/Program')
declare function require(string): string;
class Material extends JThreeObjectWithID {
    private defferedPrePassProgram: Program;
    constructor() {
        super();
        var jThreeContext = JThreeContextProxy.getJThreeContext();
        var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
        var fs = require('../Shaders/Deffered/RB1.glsl');
        var rm = jThreeContext.ResourceManager;
        var vsShader = rm.createShader("jthree.shaders.vertex.basic", vs, ShaderType.VertexShader);
        var fsShader = rm.createShader("jthree.shaders.fragment.deffered.rb1", fs, ShaderType.FragmentShader);
        vsShader.loadAll();
        fsShader.loadAll();
        this.defferedPrePassProgram = jThreeContext.ResourceManager.createProgram("jthree.programs.rb1", [vsShader, fsShader]);
    }

    private priorty: number;

    get Priorty(): number {
        return this.priorty;
    }

    private cullMode: GLCullMode = GLCullMode.Front;

    get CullMode(): GLCullMode {
        return this.cullMode;
    }

    private cullEnabled: boolean = true;

    get CullEnabled(): boolean {
        return this.cullEnabled;
    }

    set CullEnabled(val: boolean) {
        this.cullEnabled = val;
    }

    public configureDefferedPrePassMaterial(renderer: RendererBase, object: SceneObject): void {
        this.applyCullConfigure(renderer);
        var geometry = object.Geometry;
        var programWrapper = this.defferedPrePassProgram.getForContext(renderer.ContextManager);
        programWrapper.useProgram();
        var v = this.CalculateMVPMatrix(renderer, object);
        programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("normal", geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setUniformMatrix("matMVP", v);
        programWrapper.setUniformMatrix("matV", renderer.Camera.ViewMatrix);
        programWrapper.setUniformMatrix("matMV", Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal));
        geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
    }

    public configureMaterial(renderer: RendererBase, object: SceneObject): void {
        this.applyCullConfigure(renderer);
        return;
    }

    protected applyCullConfigure(renderer: RendererBase) {
        if (this.CullEnabled) {
            renderer.GLContext.Enable(
                GLFeatureType.CullFace);
            renderer.GLContext.CullFace(this.cullMode);
        }
        else {
            renderer.GLContext.Disable(GLFeatureType.CullFace);
        }
    }

    /**
    * Calculate MVP(Model-View-Projection) matrix
    */
    protected CalculateMVPMatrix(renderer: RendererBase, object: SceneObject): Matrix {
        return Matrix.multiply(Matrix.multiply(renderer.Camera.ProjectionMatrix, renderer.Camera.ViewMatrix), object.Transformer.LocalToGlobal);
    }
}

export =Material;
