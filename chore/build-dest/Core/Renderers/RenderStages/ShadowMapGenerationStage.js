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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvUmVuZGVyZXJzL1JlbmRlclN0YWdlcy9TaGFkb3dNYXBHZW5lcmF0aW9uU3RhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsZ0RBQWdEO0FBQ2hELDREQUE0RDtBQUM1RCxtREFBbUQ7QUFDbkQsa0VBQWtFO0FBQ2xFLG1DQUFtQztBQUNuQyx3REFBd0Q7QUFDeEQseURBQXlEO0FBQ3pELDZDQUE2QztBQUM3QyxpRUFBaUU7QUFDakUseURBQXlEO0FBQ3pELElBQUk7QUFDSiwyQ0FBMkM7QUFDM0MsUUFBUTtBQUNSLDJCQUEyQjtBQUMzQixRQUFRO0FBQ1IsRUFBRTtBQUNGLHlFQUF5RTtBQUN6RSxRQUFRO0FBQ1IsMEVBQTBFO0FBQzFFLFFBQVE7QUFDUixFQUFFO0FBQ0YsK0RBQStEO0FBQy9ELFFBQVE7QUFDUiw4QkFBOEI7QUFDOUIsMkJBQTJCO0FBQzNCLFlBQVk7QUFDWixjQUFjO0FBQ2QsMEZBQTBGO0FBQzFGLHdCQUF3QjtBQUN4QixpQkFBaUI7QUFDakIsNkZBQTZGO0FBQzdGLDZCQUE2QjtBQUM3QixnQ0FBZ0M7QUFDaEMsZ0JBQWdCO0FBQ2hCLGtCQUFrQjtBQUNsQixxREFBcUQ7QUFDckQseUZBQXlGO0FBQ3pGLG1CQUFtQjtBQUNuQixXQUFXO0FBQ1gsUUFBUTtBQUNSLEVBQUU7QUFDRixnRUFBZ0U7QUFDaEUsUUFBUTtBQUNSLGdEQUFnRDtBQUNoRCxRQUFRO0FBQ1IsRUFBRTtBQUNGLEVBQUU7QUFDRixnR0FBZ0c7QUFDaEcsRUFBRTtBQUNGLFFBQVE7QUFDUixFQUFFO0FBQ0Ysc0ZBQXNGO0FBQ3RGLDBDQUEwQztBQUMxQyxnRkFBZ0Y7QUFDaEYsMkdBQTJHO0FBQzNHLGdHQUFnRztBQUNoRyxRQUFRO0FBQ1IsRUFBRTtBQUNGLEVBQUU7QUFDRiw4RkFBOEY7QUFDOUYsdUJBQXVCO0FBQ3ZCLFFBQVE7QUFDUixFQUFFO0FBQ0YsNkNBQTZDO0FBQzdDLFFBQVE7QUFDUixnRUFBZ0U7QUFDaEUsUUFBUTtBQUNSLEVBQUU7QUFDRixzREFBc0Q7QUFDdEQsUUFBUTtBQUNSLDBCQUEwQjtBQUMxQixRQUFRO0FBQ1IsRUFBRTtBQUNGLHFDQUFxQztBQUNyQyxRQUFRO0FBQ1IsbUJBQW1CO0FBQ25CLDhCQUE4QjtBQUM5QixhQUFhO0FBQ2IsUUFBUTtBQUNSLElBQUk7QUFDSiwyQ0FBMkMiLCJmaWxlIjoiQ29yZS9SZW5kZXJlcnMvUmVuZGVyU3RhZ2VzL1NoYWRvd01hcEdlbmVyYXRpb25TdGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBCYXNpY1JlbmRlcmVyIGZyb20gXCIuLi9CYXNpY1JlbmRlcmVyXCI7XG4vLyBpbXBvcnQgU2NlbmVPYmplY3QgZnJvbSBcIi4uLy4uL1NjZW5lT2JqZWN0cy9TY2VuZU9iamVjdFwiO1xuLy8gaW1wb3J0IFJlbmRlclN0YWdlQmFzZSBmcm9tIFwiLi9SZW5kZXJTdGFnZUJhc2VcIjtcbi8vIGltcG9ydCBDbGVhclRhcmdldFR5cGUgZnJvbSBcIi4uLy4uLy4uL1dyYXBwZXIvQ2xlYXJUYXJnZXRUeXBlXCI7XG4vLyBpbXBvcnQgU2NlbmUgZnJvbSBcIi4uLy4uL1NjZW5lXCI7XG4vLyBpbXBvcnQgUmVzb2x2ZWRDaGFpbkluZm8gZnJvbSBcIi4uL1Jlc29sdmVkQ2hhaW5JbmZvXCI7XG4vLyBpbXBvcnQgUHJvZ3JhbSBmcm9tIFwiLi4vLi4vUmVzb3VyY2VzL1Byb2dyYW0vUHJvZ3JhbVwiO1xuLy8gaW1wb3J0IE1hdHJpeCBmcm9tIFwiLi4vLi4vLi4vTWF0aC9NYXRyaXhcIjtcbi8vIGltcG9ydCBDdWJlVGV4dHVyZSBmcm9tIFwiLi4vLi4vUmVzb3VyY2VzL1RleHR1cmUvQ3ViZVRleHR1cmVcIjtcbi8vIGNsYXNzIFNoYWRvd01hcEdlbmVyYXRpb25TdGFnZSBleHRlbmRzIFJlbmRlclN0YWdlQmFzZVxuLy8ge1xuLy8gICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVyOiBCYXNpY1JlbmRlcmVyKVxuLy8gICAgIHtcbi8vICAgICAgICAgc3VwZXIocmVuZGVyZXIpO1xuLy8gICAgIH1cbi8vXG4vLyAgICAgcHJpdmF0ZSBnZXRTaGFkb3dEcm9wcGFibGVMaWdodChzY2VuZTpTY2VuZSx0ZWNobmlxdWVJbmRleDpudW1iZXIpXG4vLyAgICAge1xuLy8gICAgICAgcmV0dXJuIHNjZW5lLkxpZ2h0UmVnaXN0ZXIuc2hhZG93RHJvcHBhYmxlTGlnaHRzW3RlY2huaXF1ZUluZGV4XTtcbi8vICAgICB9XG4vL1xuLy8gICAgIHB1YmxpYyBwcmVTdGFnZShzY2VuZTpTY2VuZSxjaGFpbkluZm86UmVzb2x2ZWRDaGFpbkluZm8pXG4vLyAgICAge1xuLy8gICAgICAgdGhpcy5iaW5kQXNPdXRCdWZmZXIoXG4vLyAgICAgICAgIHRoaXMuRGVmYXVsdEZCTyxcbi8vICAgICAgICAgW1xuLy8gICAgICAgICAgIHtcbi8vICAgICAgICAgICAgIHRleHR1cmU6IHNjZW5lLkxpZ2h0UmVnaXN0ZXIuc2hhZG93TWFwUmVzb3VyY2VNYW5hZ2VyLnNoYWRvd01hcFRpbGVUZXh0dXJlLFxuLy8gICAgICAgICAgICAgdGFyZ2V0OiAwXG4vLyAgICAgICAgICAgfSwge1xuLy8gICAgICAgICAgICAgICB0ZXh0dXJlOiBzY2VuZS5MaWdodFJlZ2lzdGVyLnNoYWRvd01hcFJlc291cmNlTWFuYWdlci5zaGFkb3dNYXBSZW5kZXJCdWZmZXIsXG4vLyAgICAgICAgICAgICAgIHR5cGU6IFwicmJvXCIsXG4vLyAgICAgICAgICAgICAgIHRhcmdldDogXCJkZXB0aFwiXG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgIF0sKCk9Pntcbi8vICAgICAgICAgICB0aGlzLlJlbmRlcmVyLkdMLmNsZWFyQ29sb3IoMCwgMCwgMCwgMCk7XG4vLyAgICAgICAgICAgdGhpcy5SZW5kZXJlci5HTC5jbGVhcihDbGVhclRhcmdldFR5cGUuQ29sb3JCaXRzfENsZWFyVGFyZ2V0VHlwZS5EZXB0aEJpdHMpO1xuLy8gICAgICAgICB9LCgpPT57fVxuLy8gICAgICAgKTtcbi8vICAgICB9XG4vL1xuLy8gICAgIHB1YmxpYyBwb3N0U3RhZ2Uoc2NlbmU6U2NlbmUsY2hhaW5JbmZvOlJlc29sdmVkQ2hhaW5JbmZvKVxuLy8gICAgIHtcbi8vICAgICAgIHRoaXMuUmVuZGVyZXIuYXBwbHlWaWV3cG9ydENvbmZpZ3VyZSgpO1xuLy8gICAgIH1cbi8vXG4vL1xuLy8gICAgIHB1YmxpYyBwcmVUZWNobmlxdWUoc2NlbmU6IFNjZW5lLCB0ZWNobmlxdWVDb3VudDogbnVtYmVyLCBjaGFpbkluZm86IFJlc29sdmVkQ2hhaW5JbmZvKSB7XG4vL1xuLy8gICAgIH1cbi8vXG4vLyAgICAgcHVibGljIHJlbmRlcihzY2VuZTogU2NlbmUsIG9iamVjdDogU2NlbmVPYmplY3QsIHRlY2huaXF1ZUNvdW50OiBudW1iZXIsdGV4cykge1xuLy8gICAgICAgICB2YXIgZ2VvbWV0cnkgPSBvYmplY3QuR2VvbWV0cnk7XG4vLyAgICAgICAgIHZhciB0YXJnZXRMaWdodCA9IHRoaXMuZ2V0U2hhZG93RHJvcHBhYmxlTGlnaHQoc2NlbmUsdGVjaG5pcXVlQ291bnQpO1xuLy8gICAgICAgICBzY2VuZS5MaWdodFJlZ2lzdGVyLnNoYWRvd01hcFJlc291cmNlTWFuYWdlci5zZXRTaGFkb3dNYXBWaWV3cG9ydCh0aGlzLlJlbmRlcmVyLHRlY2huaXF1ZUNvdW50KTtcbi8vICAgICAgICAgdGhpcy5kcmF3Rm9yTWF0ZXJpYWxzKHNjZW5lLG9iamVjdCx0ZWNobmlxdWVDb3VudCx0ZXhzLFwianRocmVlLm1hdGVyaWFscy5zaGFkb3dtYXBcIik7XG4vLyAgICAgfVxuLy9cbi8vXG4vLyAgICAgcHVibGljIG5lZWRSZW5kZXIoc2NlbmU6IFNjZW5lLCBvYmplY3Q6IFNjZW5lT2JqZWN0LCB0ZWNobmlxdWVDb3VudDogbnVtYmVyKTogYm9vbGVhbiB7XG4vLyAgICAgICAgIHJldHVybiB0cnVlO1xuLy8gICAgIH1cbi8vXG4vLyAgICAgcHVibGljIGdldFRlY2huaXF1ZUNvdW50KHNjZW5lOiBTY2VuZSlcbi8vICAgICB7XG4vLyAgICAgICAgIHJldHVybiBzY2VuZS5MaWdodFJlZ2lzdGVyLlNoYWRvd0Ryb3BwYWJsZUxpZ2h0Q291bnQ7XG4vLyAgICAgfVxuLy9cbi8vICAgICBwdWJsaWMgZ2V0VGFyZ2V0KHRlY2huaXF1ZUluZGV4Om51bWJlcik6IHN0cmluZ1xuLy8gICAgIHtcbi8vICAgICAgICAgcmV0dXJuIFwic2NlbmVcIjtcbi8vICAgICB9XG4vL1xuLy8gICAgIHB1YmxpYyBnZXQgUmVuZGVyU3RhZ2VDb25maWcoKVxuLy8gICAgIHtcbi8vICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICAgIGRlcHRoVGVzdDogdHJ1ZVxuLy8gICAgICAgICB9O1xuLy8gICAgIH1cbi8vIH1cbi8vIGV4cG9ydCBkZWZhdWx0IFNoYWRvd01hcEdlbmVyYXRpb25TdGFnZTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
