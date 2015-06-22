import JThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Matrix = require("../../Math/Matrix");
import GLCullMode = require("../../Wrapper/GLCullMode");
import GLFeatureType = require("../../Wrapper/GLFeatureType");
import JThreeContextProxy = require('./../JThreeContextProxy');
import ShaderType = require("../../Wrapper/ShaderType");
import Program = require('../Resources/Program/Program');
import TextureRegister = require('../../Wrapper/Texture/TextureRegister');
import TextureBase = require('../Resources/Texture/TextureBase');
import TargetTextureType = require('../../Wrapper/TargetTextureType');
declare function require(string): string;
class Material extends JThreeObjectWithID {
    private defferedRb1Program: Program;
    private defferedRb2Program: Program;
    
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
        this.defferedRb1Program = jThreeContext.ResourceManager.createProgram("jthree.programs.rb1", [vsShader, fsShader]);
        fsShader=rm.createShader('jthree.shaders.fragment.deffered.rb2',require('../Shaders/Deffered/RB2.glsl'),ShaderType.FragmentShader);
        fsShader.loadAll();
        this.defferedRb2Program = jThreeContext.ResourceManager.createProgram("jthree.programs.rb2",[vsShader,fsShader]);
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

    public configureDefferedPrePassMaterial(renderer: RendererBase, object: SceneObject,passCount:number): void {
        this.applyCullConfigure(renderer);
        var context = JThreeContextProxy.getJThreeContext();
        var geometry = object.Geometry;
        var programWrapper =null;
        switch(passCount)
        {
            case 0:
                 programWrapper=this.defferedRb1Program.getForContext(renderer.ContextManager);
            break;
            case 1:
                             programWrapper=this.defferedRb1Program.getForContext(renderer.ContextManager);
            break;
        }
        programWrapper.useProgram();
        var v = this.CalculateMVPMatrix(renderer, object);
        programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("normal", geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
        programWrapper.setAttributeVerticies("uv", geometry.UVBuffer.getForRenderer(renderer.ContextManager));
        var tex=context.ResourceManager.getTexture("test");
        renderer.ContextManager.Context.ActiveTexture(TextureRegister.Texture0);
        if(tex)tex.getForContext(renderer.ContextManager).bind();
        else renderer.GLContext.BindTexture(TargetTextureType.Texture2D,null);
        programWrapper.setUniformMatrix("matMVP", v);
        programWrapper.setUniformMatrix("matV", renderer.Camera.ViewMatrix);
        programWrapper.setUniformMatrix("matMV", Matrix.multiply(renderer.Camera.ViewMatrix, object.Transformer.LocalToGlobal));
        programWrapper.setUniform1i("texture",0);
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
