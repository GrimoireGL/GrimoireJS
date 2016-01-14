import IndexedGeometry = require("../../Geometries/IndexedGeometry");
import BasicGeometry = require("../../Geometries/BasicGeometry");
﻿import BasicRenderer = require('../BasicRenderer');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import Program = require("../../Resources/Program/Program");
import Matrix = require("../../../Math/Matrix");
import CubeTexture = require("../../Resources/Texture/CubeTexture");
class SkyBoxStage extends RenderStageBase
{
    public skyBoxTexture:CubeTexture;

    private program:Program;

    constructor(renderer: BasicRenderer)
    {
        super(renderer);
        var vs = require("../../Shaders/VertexShaders/SkyboxGeometries.glsl");
        var fs = require("../../Shaders/SkyBox.glsl");
        this.program = this.loadProgram("jthree.shaders.vertex.skybox", "jthree.shaders.fragment.skybox", "jthree.programs.skybox", vs, fs);
    }


    public preTechnique(scene: Scene, passCount: number, chainInfo: ResolvedChainInfo) {
        this.Renderer.GL.bindFramebuffer(this.Renderer.GL.FRAMEBUFFER,null);
        this.GL.clear(this.GL.DEPTH_BUFFER_BIT);
        this.GL.disable(this.GL.DEPTH_TEST);
        this.GL.disable(this.GL.BLEND);
    }

    public render(scene: Scene, object: SceneObject, passCount: number) {
        var geometry = <BasicGeometry>object.Geometry;
        var pWrapper = this.program.getForContext(this.Renderer.ContextManager);
        this.GL.cullFace(this.GL.FRONT);
        pWrapper.useProgram();
        pWrapper.assignAttributeVariable("position",geometry.positionBuffer);
        pWrapper.assignAttributeVariable("uv",geometry.uvBuffer);
        pWrapper.uniformSampler("skyTex",this.skyBoxTexture,0);
        pWrapper.uniformMatrix("matVP",this.Renderer.Camera.viewMatrix);
        geometry.drawElements(this.Renderer.ContextManager,null);
    }


    public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
        return !!this.skyBoxTexture;
    }

    public getTechniqueCount(scene: Scene)
    {
        return 1;
    }

    public getTarget(techniqueIndex:number): string
    {
        return "cube";
    }

    public get RenderStageConfig()
    {
        return {
            depthTest: false
        };
    }
}
export = SkyBoxStage;
