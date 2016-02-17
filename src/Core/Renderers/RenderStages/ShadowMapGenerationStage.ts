// import BasicRenderer from "../BasicRenderer";
// import SceneObject from "../../SceneObjects/SceneObject";
// import RenderStageBase from "./RenderStageBase";
// import ClearTargetType from "../../../Wrapper/ClearTargetType";
// import Scene from "../../Scene";
// import ResolvedChainInfo from "../ResolvedChainInfo";
// import Program from "../../Resources/Program/Program";
// import Matrix from "../../../Math/Matrix";
// import CubeTexture from "../../Resources/Texture/CubeTexture";
// class ShadowMapGenerationStage extends RenderStageBase
// {
//     constructor(renderer: BasicRenderer)
//     {
//         super(renderer);
//     }
//
//     private getShadowDroppableLight(scene:Scene,techniqueIndex:number)
//     {
//       return scene.LightRegister.shadowDroppableLights[techniqueIndex];
//     }
//
//     public preStage(scene:Scene,chainInfo:ResolvedChainInfo)
//     {
//       this.bindAsOutBuffer(
//         this.DefaultFBO,
//         [
//           {
//             texture: scene.LightRegister.shadowMapResourceManager.shadowMapTileTexture,
//             target: 0
//           }, {
//               texture: scene.LightRegister.shadowMapResourceManager.shadowMapRenderBuffer,
//               type: "rbo",
//               target: "depth"
//             }
//         ],()=>{
//           this.Renderer.GL.clearColor(0, 0, 0, 0);
//           this.Renderer.GL.clear(ClearTargetType.ColorBits|ClearTargetType.DepthBits);
//         },()=>{}
//       );
//     }
//
//     public postStage(scene:Scene,chainInfo:ResolvedChainInfo)
//     {
//       this.Renderer.applyViewportConfigure();
//     }
//
//
//     public preTechnique(scene: Scene, techniqueCount: number, chainInfo: ResolvedChainInfo) {
//
//     }
//
//     public render(scene: Scene, object: SceneObject, techniqueCount: number,texs) {
//         var geometry = object.Geometry;
//         var targetLight = this.getShadowDroppableLight(scene,techniqueCount);
//         scene.LightRegister.shadowMapResourceManager.setShadowMapViewport(this.Renderer,techniqueCount);
//         this.drawForMaterials(scene,object,techniqueCount,texs,"jthree.materials.shadowmap");
//     }
//
//
//     public needRender(scene: Scene, object: SceneObject, techniqueCount: number): boolean {
//         return true;
//     }
//
//     public getTechniqueCount(scene: Scene)
//     {
//         return scene.LightRegister.ShadowDroppableLightCount;
//     }
//
//     public getTarget(techniqueIndex:number): string
//     {
//         return "scene";
//     }
//
//     public get RenderStageConfig()
//     {
//         return {
//             depthTest: true
//         };
//     }
// }
// export default ShadowMapGenerationStage;
