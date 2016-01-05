import IMaterialConfigureArgument = require("../Base/IMaterialConfigureArgument");
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

    public configureMaterial(matArg:IMaterialConfigureArgument): void
    {
        var renderer = matArg.renderStage.Renderer;
        var geometry = matArg.object.Geometry;
        var pWrapper = this.program.getForContext(renderer.ContextManager);
        var v = matArg.object.Transformer.calculateMVPMatrix(renderer);
        //gen ct matrix
        var ctM: Matrix = Matrix.zero();
        if (this.ctR < 4) ctM.setAt(0,this.ctR, 1);
        if (this.ctG < 4) ctM.setAt(1,this.ctG, 1);
        if (this.ctB < 4) ctM.setAt(2,this.ctB, 1);
        if (this.ctA < 4) ctM.setAt(3,this.ctA, 1);
        pWrapper.useProgram();
        pWrapper.assignAttributeVariable("position",geometry.PositionBuffer);
        pWrapper.assignAttributeVariable("normal",geometry.NormalBuffer);
        pWrapper.assignAttributeVariable("uv",geometry.UVBuffer);
        pWrapper.uniformMatrix("matMVP",v);
        pWrapper.uniformMatrix("matV",renderer.Camera.viewMatrix);
        pWrapper.uniformMatrix("matMV", Matrix.multiply(renderer.Camera.viewMatrix, matArg.object.Transformer.LocalToGlobal) );
        pWrapper.uniformSampler2D("u_sampler",this.texture,0);
        pWrapper.uniformInt("additionA",this.ctA < 4 ? 0 : 1 );
        pWrapper.uniformMatrix("ctM",ctM);
        geometry.bindIndexBuffer(renderer.ContextManager);
    }
}

export =SpriteMaterial;
