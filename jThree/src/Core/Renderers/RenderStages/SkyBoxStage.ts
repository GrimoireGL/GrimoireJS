﻿import RendererBase = require('../RendererBase');
import SceneObject = require('../../SceneObject');
import RenderStageBase = require('./RenderStageBase');
import ClearTargetType = require("../../../Wrapper/ClearTargetType");
import Scene = require('../../Scene');
import ResolvedChainInfo = require('../ResolvedChainInfo');
import Program = require("../../Resources/Program/Program");
import JThreeContext = require("../../JThreeContextProxy")
class SkyBoxStage extends RenderStageBase
{
    private program:Program;
    constructor(renderer: RendererBase)
    {
        super(renderer);
        var vs = require("../../Shaders/VertexShaders/PostEffectGeometries.glsl");
        var fs = require("../../Shaders/Skybox.glsl");
        this.program = this.loadProgram("jthree.shaders.vertex.post", "jthree.shaders.fragment.skybox", "jthree.programs.skybox", vs, fs);
    }


    public preBeginStage(scene: Scene, passCount: number, chainInfo: ResolvedChainInfo) {
        this.Renderer.GLContext.BindFrameBuffer(null);
/*        debugger;
        this.bindAsOutBuffer(this.DefaultFBO, [
            {
                texture: chainInfo["OUT"],
                target: 0
            }
        ], () =>
            {
                this.Renderer.GLContext.ClearColor(0, 0, 0, 0);
                this.Renderer.GLContext.Clear(ClearTargetType.ColorBits | ClearTargetType.DepthBits);
            });*/
    }

    public render(scene: Scene, object: SceneObject, passCount: number) {
        var geometry = object.Geometry;
        if (!geometry) return;
        var pw = this.program.getForContext(this.Renderer.ContextManager);
        pw.register({
            attributes: {
                position: geometry.PositionBuffer,
                uv:geometry.UVBuffer
            },
            uniforms: {
/*
                skyTex: { type: "texture", register: 0, value: JThreeContext.getJThreeContext().ResourceManager.getTexture("testcube") }
*/
            }
        });
        geometry.IndexBuffer.getForRenderer(this.Renderer.ContextManager).bindBuffer();

    }


    public needRender(scene: Scene, object: SceneObject, passCount: number): boolean {
        return true;
    }

    public getPassCount(scene: Scene)
    {
        return 1;
    }

    public get TargetGeometry(): string
    {
        return "cube";
    }

    public get RenderStageConfig()
    {
        return {
            depthTest: false,
            cullFace: false
        };
    }
}
export = SkyBoxStage; 