/// <reference path="../refs/ammo/ammo.d.ts" />
/// <reference path="../refs/bundle.ts" />
/// <reference path="../refs/chai/chai.d.ts" />
/// <reference path="../refs/empower/empower.d.ts" />
/// <reference path="../refs/gl-matrix/gl-matrix.d.ts" />
/// <reference path="../refs/jsdom/jsdom.d.ts" />
/// <reference path="../refs/mocha/mocha.d.ts" />
/// <reference path="../refs/node/node.d.ts" />
/// <reference path="../refs/power-assert-formatter/power-assert-formatter.d.ts" />
/// <reference path="../refs/power-assert/power-assert.d.ts" />
/// <reference path="../refs/q/q.d.ts" />
/// <reference path="../refs/sinon-chai/sinon-chai.d.ts" />
/// <reference path="../refs/sinon/sinon.d.ts" />
/// <reference path="../refs/superagent/superagent.d.ts" />
/// <reference path="Base/Collections/ArrayEnumratorFactory.ts" />
/// <reference path="Base/Collections/AssociativeArray.ts" />
/// <reference path="Base/Collections/Collection.ts" />
/// <reference path="Base/Collections/IEnumerable.ts" />
/// <reference path="Base/Collections/IEnumrator.ts" />
/// <reference path="Base/Color/Color3.ts" />
/// <reference path="Base/Color/Color4.ts" />
/// <reference path="Base/Delegates.ts" />
/// <reference path="Base/IStringConvertable.ts" />
/// <reference path="Base/JThreeCollection.ts" />
/// <reference path="Base/JThreeEvent.ts" />
/// <reference path="Base/JThreeID.ts" />
/// <reference path="Base/JThreeLogger.ts" />
/// <reference path="Base/JThreeObject.ts" />
/// <reference path="Base/JThreeObjectWithID.ts" />
/// <reference path="Base/JsHack.ts" />
/// <reference path="ContextComponents.ts" />
/// <reference path="Core/Camera/Camera.ts" />
/// <reference path="Core/Camera/OrthoCamera.ts" />
/// <reference path="Core/Camera/PerspectiveCamera.ts" />
/// <reference path="Core/Camera/ViewCameraBase.ts" />
/// <reference path="Core/Canvas.ts" />
/// <reference path="Core/CanvasListChangedEventArgs.ts" />
/// <reference path="Core/CanvasManager.ts" />
/// <reference path="Core/CanvasSizeChangedEventArgs.ts" />
/// <reference path="Core/ContextManagerBase.ts" />
/// <reference path="Core/ContextTimer.ts" />
/// <reference path="Core/GLExtensionList.ts" />
/// <reference path="Core/GLExtensionManager.ts" />
/// <reference path="Core/GLSpecManager.ts" />
/// <reference path="Core/Geometries/CircleGeometry.ts" />
/// <reference path="Core/Geometries/CubeGeometry.ts" />
/// <reference path="Core/Geometries/CylinderGeometry.ts" />
/// <reference path="Core/Geometries/Geometry.ts" />
/// <reference path="Core/Geometries/GridGeometry.ts" />
/// <reference path="Core/Geometries/QuadGeometry.ts" />
/// <reference path="Core/Geometries/TriangleGeometry.ts" />
/// <reference path="Core/ISceneListChangedEventArgs.ts" />
/// <reference path="Core/ISceneObjectChangedEventArgs.ts" />
/// <reference path="Core/Light/DefaultLightTypeList.ts" />
/// <reference path="Core/Light/Impl/AreaLight.ts" />
/// <reference path="Core/Light/Impl/DirectionalLight.ts" />
/// <reference path="Core/Light/Impl/PointLight.ts" />
/// <reference path="Core/Light/Impl/SceneLight.ts" />
/// <reference path="Core/Light/Impl/SpotLight.ts" />
/// <reference path="Core/Light/LightBase.ts" />
/// <reference path="Core/Light/LightRegister.ts" />
/// <reference path="Core/Light/LightShderComposer.ts" />
/// <reference path="Core/Light/LightTypeDeclaration.ts" />
/// <reference path="Core/Light/ShadowMap/ShadowDroppableLight.ts" />
/// <reference path="Core/Light/ShadowMap/ShadowMapResourceManager.ts" />
/// <reference path="Core/Light/ShadowMap/ShadowMathHelper.ts" />
/// <reference path="Core/ListStateChangedType.ts" />
/// <reference path="Core/LoopManager.ts" />
/// <reference path="Core/Materials/GBufferMaterial.ts" />
/// <reference path="Core/Materials/IMaterialConfig.ts" />
/// <reference path="Core/Materials/Material.ts" />
/// <reference path="Core/Materials/PhongMaterial.ts" />
/// <reference path="Core/Materials/ShadowMapMaterial.ts" />
/// <reference path="Core/Materials/SolidColorMaterial.ts" />
/// <reference path="Core/Materials/SpriteMaterial.ts" />
/// <reference path="Goml/NodeManager.ts" />
/// <reference path="Core/RendererListChangedEventArgs.ts" />
/// <reference path="Core/Renderers/FBOBindData.ts" />
/// <reference path="Core/Renderers/IRenderObjectCompletedEventArgs.ts" />
/// <reference path="Core/Renderers/IRenderPathCompletedEventArgs.ts" />
/// <reference path="Core/Renderers/IRenderStageCompletedEventArgs.ts" />
/// <reference path="Core/Renderers/RenderPath.ts" />
/// <reference path="Core/Renderers/RenderPathExecutor.ts" />
/// <reference path="Core/Renderers/RenderStageChain.ts" />
/// <reference path="Core/Renderers/RenderStageConfig.ts" />
/// <reference path="Core/Renderers/RenderStages/FowardShadingStage.ts" />
/// <reference path="Core/Renderers/RenderStages/GBuffer/GBufferStage.ts" />
/// <reference path="Core/Renderers/RenderStages/GrayScaleStage.ts" />
/// <reference path="Core/Renderers/RenderStages/LightAccumulationStage.ts" />
/// <reference path="Core/Renderers/RenderStages/RenderStageBase.ts" />
/// <reference path="Core/Renderers/RenderStages/ShadowMapGenerationStage.ts" />
/// <reference path="Core/Renderers/RenderStages/SkyBoxStage.ts" />
/// <reference path="Core/Renderers/RendererBase.ts" />
/// <reference path="Core/Renderers/RendererConfigurator/BasicRendererConfigurator.ts" />
/// <reference path="Core/Renderers/RendererConfigurator/RendererConfiguratorBase.ts" />
/// <reference path="Core/Renderers/RendererConfigurator/SpriteRendererConfigurator.ts" />
/// <reference path="Core/Renderers/RendererFactory.ts" />
/// <reference path="Core/Renderers/ResolvedChainInfo.ts" />
/// <reference path="Core/Renderers/TextureGenerater.ts" />
/// <reference path="Core/Renderers/TextureGeneraters/GeneraterBase.ts" />
/// <reference path="Core/Renderers/TextureGeneraters/GeneraterInfo.ts" />
/// <reference path="Core/Renderers/TextureGeneraters/GeneraterInfoChunk.ts" />
/// <reference path="Core/Renderers/TextureGeneraters/GeneraterList.ts" />
/// <reference path="Core/Renderers/TextureGeneraters/RendererFit.ts" />
/// <reference path="Core/ResourceManager.ts" />
/// <reference path="Core/Resources/Buffer/Buffer.ts" />
/// <reference path="Core/Resources/Buffer/BufferWrapper.ts" />
/// <reference path="Core/Resources/ContextSafeResourceContainer.ts" />
/// <reference path="Core/Resources/FBO/FBO.ts" />
/// <reference path="Core/Resources/FBO/FBOWrapper.ts" />
/// <reference path="Core/Resources/Program/Program.ts" />
/// <reference path="Core/Resources/Program/ProgramWrapper.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/AttributeRegisteringArgument.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/AttributeRegisteringConfigure.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/UniformRegisteringArgument.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/UniformRegisteringConfigure.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/Uniforms/MatrixFLoatArrayRegister.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/Uniforms/MatrixFloatRegister.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/Uniforms/ScalarFloatRegister.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/Uniforms/ScalarIntegerRegister.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/Uniforms/Texture2DRegister.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/Uniforms/TextureArrayRegister.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/Uniforms/UniformTypeList.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/Uniforms/UniformVariableRegisterBase.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/Uniforms/VectorFloatArrayRegister.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/Uniforms/VectorFloatRegister.ts" />
/// <reference path="Core/Resources/Program/VariableRegister/VariableRegisteringArgument.ts" />
/// <reference path="Core/Resources/RBO/RBO.ts" />
/// <reference path="Core/Resources/RBO/RBOWrapper.ts" />
/// <reference path="Core/Resources/ResourceArray.ts" />
/// <reference path="Core/Resources/ResourceWrapper.ts" />
/// <reference path="Core/Resources/Shader/Shader.ts" />
/// <reference path="Core/Resources/Shader/ShaderWrapper.ts" />
/// <reference path="Core/Resources/Texture/BufferTexture.ts" />
/// <reference path="Core/Resources/Texture/BufferTextureWrapper.ts" />
/// <reference path="Core/Resources/Texture/CubeTexture.ts" />
/// <reference path="Core/Resources/Texture/CubeTextureWrapper.ts" />
/// <reference path="Core/Resources/Texture/Texture.ts" />
/// <reference path="Core/Resources/Texture/TextureBase.ts" />
/// <reference path="Core/Resources/Texture/TextureWrapper.ts" />
/// <reference path="Core/Resources/Texture/TextureWrapperBase.ts" />
/// <reference path="Core/Resources/VAO/VAO.ts" />
/// <reference path="Core/Resources/VAO/VAOWrapper.ts" />
/// <reference path="Core/Scene.ts" />
/// <reference path="Core/SceneManager.ts" />
/// <reference path="Core/SceneObject.ts" />
/// <reference path="Core/Timer.ts" />
/// <reference path="Core/Transform/Transformer.ts" />
/// <reference path="Debug/Debugger.ts" />
/// <reference path="Debug/DebuggerAPI.ts" />
/// <reference path="Debug/Modules/DebuggerModuleBase.ts" />
/// <reference path="Debug/Modules/GLSpecDebugger.ts" />
/// <reference path="Debug/Modules/Renderer/INotifyTextureProgress.ts" />
/// <reference path="Debug/Modules/Renderer/IRequestBufferTexture.ts" />
/// <reference path="Debug/Modules/Renderer/IRequestBufferTextureProgress.ts" />
/// <reference path="Debug/Modules/Renderer/IRequestShadowMapProgress.ts" />
/// <reference path="Debug/Modules/Renderer/IRequestShadowMapTexture.ts" />
/// <reference path="Debug/Modules/RendererDebugger.ts" />
/// <reference path="Debug/Modules/SceneStructureDebugger.ts" />
/// <reference path="Exceptions.ts" />
/// <reference path="Goml/Animater/AnimaterBase.ts" />
/// <reference path="Goml/Animater/Color3Animater.ts" />
/// <reference path="Goml/Animater/Color4Animater.ts" />
/// <reference path="Goml/Animater/IntegerAnimater.ts" />
/// <reference path="Goml/Animater/NumberAnimater.ts" />
/// <reference path="Goml/Animater/RotationAnimater.ts" />
/// <reference path="Goml/Animater/Vector3Animater.ts" />
/// <reference path="Goml/AttributeDeclaration.ts" />
/// <reference path="Goml/AttributeDeclationBody.ts" />
/// <reference path="Goml/AttributeDictionary.ts" />
/// <reference path="Goml/AttributeParser.ts" />
/// <reference path="Goml/Behaviors/BehaviorDeclaration.ts" />
/// <reference path="Goml/Behaviors/BehaviorDeclarationBody.ts" />
/// <reference path="Goml/Behaviors/BehaviorRegistry.ts" />
/// <reference path="Goml/Behaviors/BehaviorRunner.ts" />
/// <reference path="Goml/Converter/AngleAttributeConverter.ts" />
/// <reference path="Goml/Converter/AttributeConverterBase.ts" />
/// <reference path="Goml/Converter/BooleanAttributeConverter.ts" />
/// <reference path="Goml/Converter/Color3AttributeConverter.ts" />
/// <reference path="Goml/Converter/Color4AttributeConverter.ts" />
/// <reference path="Goml/Converter/IntegerAttributeConverter.ts" />
/// <reference path="Goml/Converter/NumberAttributeConverter.ts" />
/// <reference path="Goml/Converter/RotationAttributeConverter.ts" />
/// <reference path="Goml/Converter/StringAttributeConverter.ts" />
/// <reference path="Goml/Converter/Vector3AttributeConverter.ts" />
/// <reference path="Goml/Easing/EasingFunctionBase.ts" />
/// <reference path="Goml/Easing/LinearEasingFunction.ts" />
/// <reference path="Goml/Easing/SwingEasingFunction.ts" />
/// <reference path="Goml/EasingFunctionList.ts" />
/// <reference path="Goml/Factories/BehaviorTagFactory.ts" />
/// <reference path="Goml/Factories/SceneObjectTagFactory.ts" />
/// <reference path="Goml/Factories/TagFactory.ts" />
/// <reference path="Goml/Factories/TemplateTagFactory.ts" />
/// <reference path="Goml/GomlAttribute.ts" />
/// <reference path="Goml/GomlConverterList.ts" />
/// <reference path="Goml/GomlLoader.ts" />
/// <reference path="Goml/GomlConfigurator.ts" />
/// <reference path="Goml/GomlNodeDictionary.ts" />
/// <reference path="Goml/GomlNodeEventList.ts" />
/// <reference path="Goml/GomlNodeList.ts" />
/// <reference path="Goml/GomlNodeListElement.ts" />
/// <reference path="Goml/GomlParser.ts" />
/// <reference path="Goml/GomlTreeNodeBase.ts" />
/// <reference path="Goml/Nodes/Behaviors/BehaviorNode.ts" />
/// <reference path="Goml/Nodes/Behaviors/BehaviorsNode.ts" />
/// <reference path="Goml/Nodes/Canvases/CanvasNode.ts" />
/// <reference path="Goml/Nodes/Canvases/CanvasNodeBase.ts" />
/// <reference path="Goml/Nodes/Geometries/CircleGeometryNode.ts" />
/// <reference path="Goml/Nodes/Geometries/CubeGeometryNode.ts" />
/// <reference path="Goml/Nodes/Geometries/CylinderGeometryNode.ts" />
/// <reference path="Goml/Nodes/Geometries/GeometryNodeBase.ts" />
/// <reference path="Goml/Nodes/Geometries/GridGeometryNode.ts" />
/// <reference path="Goml/Nodes/Geometries/QuadGeometryNode.ts" />
/// <reference path="Goml/Nodes/Geometries/TriangleGeometryNode.ts" />
/// <reference path="Goml/Nodes/Materials/DefferedDebugNode.ts" />
/// <reference path="Goml/Nodes/Materials/MaterialNodeBase.ts" />
/// <reference path="Goml/Nodes/Materials/PhongNode.ts" />
/// <reference path="Goml/Nodes/Materials/SolidColorNode.ts" />
/// <reference path="Goml/Nodes/Materials/SpriteNode.ts" />
/// <reference path="Goml/Nodes/Materials/TextureDebugNode.ts" />
/// <reference path="Goml/Nodes/Renderers/ViewPortNode.ts" />
/// <reference path="Goml/Nodes/SceneNode.ts" />
/// <reference path="Goml/Nodes/SceneObjects/Cameras/CameraNode.ts" />
/// <reference path="Goml/Nodes/SceneObjects/Cameras/CameraNodeBase.ts" />
/// <reference path="Goml/Nodes/SceneObjects/Cameras/OrthoCameraNode.ts" />
/// <reference path="Goml/Nodes/SceneObjects/Lights/AreaLightNode.ts" />
/// <reference path="Goml/Nodes/SceneObjects/Lights/DirectionalLightNode.ts" />
/// <reference path="Goml/Nodes/SceneObjects/Lights/LightNodeBase.ts" />
/// <reference path="Goml/Nodes/SceneObjects/Lights/PointLightNode.ts" />
/// <reference path="Goml/Nodes/SceneObjects/Lights/SceneLightNode.ts" />
/// <reference path="Goml/Nodes/SceneObjects/Lights/SpotLightNode.ts" />
/// <reference path="Goml/Nodes/SceneObjects/MeshNode.ts" />
/// <reference path="Goml/Nodes/SceneObjects/ObjectNode.ts" />
/// <reference path="Goml/Nodes/SceneObjects/SceneObjectNodeBase.ts" />
/// <reference path="Goml/Nodes/Templates/TemplateNode.ts" />
/// <reference path="Goml/Nodes/Texture/CubeTextureNode.ts" />
/// <reference path="Goml/Nodes/Texture/TextureNode.ts" />
/// <reference path="Goml/Nodes/Texture/TextureNodeBase.ts" />
/// <reference path="Goml/TreeNodeBase.ts" />
/// <reference path="IContextComponent.ts" />
/// <reference path="Init.ts" />
/// <reference path="JThreeInterface.ts" />
/// <reference path="Math/AABB.ts" />
/// <reference path="Math/Matrix.ts" />
/// <reference path="Math/MatrixBase.ts" />
/// <reference path="Math/PointList.ts" />
/// <reference path="Math/Quaternion.ts" />
/// <reference path="Math/Rectangle.ts" />
/// <reference path="Math/Vector2.ts" />
/// <reference path="Math/Vector3.ts" />
/// <reference path="Math/Vector4.ts" />
/// <reference path="Math/VectorBase.ts" />
/// <reference path="NJThreeContext.ts" />
/// <reference path="PMX/Core/PMXBone.ts" />
/// <reference path="PMX/Core/PMXBoneTransformer.ts" />
/// <reference path="PMX/Core/PMXGBufferMaterial.ts" />
/// <reference path="PMX/Core/PMXGeometry.ts" />
/// <reference path="PMX/Core/PMXMaterial.ts" />
/// <reference path="PMX/Core/PMXMaterialMorphParamContainer.ts" />
/// <reference path="PMX/Core/PMXModel.ts" />
/// <reference path="PMX/Core/PMXMorph.ts" />
/// <reference path="PMX/Core/PMXMorphManager.ts" />
/// <reference path="PMX/Core/PMXShadowMapMaterial.ts" />
/// <reference path="PMX/Core/PMXSkeleton.ts" />
/// <reference path="PMX/Core/PMXTextureManager.ts" />
/// <reference path="PMX/Goml/Factory/PMXBoneTagFactory.ts" />
/// <reference path="PMX/Goml/Factory/PMXMorphTagFactory.ts" />
/// <reference path="PMX/Goml/PMXBoneNode.ts" />
/// <reference path="PMX/Goml/PMXBonesNode.ts" />
/// <reference path="PMX/Goml/PMXMorphNode.ts" />
/// <reference path="PMX/Goml/PMXMorphsNode.ts" />
/// <reference path="PMX/Goml/PMXNode.ts" />
/// <reference path="PMX/Joints/SpringJoint.ts" />
/// <reference path="PMX/Morphs/BoneMorph.ts" />
/// <reference path="PMX/Morphs/GroupMorph.ts" />
/// <reference path="PMX/Morphs/MaterialMorph.ts" />
/// <reference path="PMX/Morphs/UVMorph.ts" />
/// <reference path="PMX/Morphs/VertexMorph.ts" />
/// <reference path="PMX/PMXBone.ts" />
/// <reference path="PMX/PMXDisplayFrame.ts" />
/// <reference path="PMX/PMXHeader.ts" />
/// <reference path="PMX/PMXIKLink.ts" />
/// <reference path="PMX/PMXJoint.ts" />
/// <reference path="PMX/PMXLoader.ts" />
/// <reference path="PMX/PMXMaterial.ts" />
/// <reference path="PMX/PMXMorph.ts" />
/// <reference path="PMX/PMXRigidBody.ts" />
/// <reference path="PMX/PMXVertex.ts" />
/// <reference path="PMX/PMXVerticies.ts" />
/// <reference path="PMX/SDEF.ts" />
/// <reference path="Shapes/BasicMeshObject.ts" />
/// <reference path="Shapes/Mesh.ts" />
/// <reference path="VMD/Goml/VMDNode.ts" />
/// <reference path="VMD/Parser/BezierCurve.ts" />
/// <reference path="VMD/Parser/VMDBoneStatus.ts" />
/// <reference path="VMD/Parser/VMDData.ts" />
/// <reference path="VMD/Parser/VMDFrameData.ts" />
/// <reference path="VMD/Parser/VMDHeader.ts" />
/// <reference path="VMD/Parser/VMDMorph.ts" />
/// <reference path="VMD/Parser/VMDMorphStatus.ts" />
/// <reference path="VMD/Parser/VMDMorphs.ts" />
/// <reference path="VMD/Parser/VMDMotion.ts" />
/// <reference path="VMD/Parser/VMDMotions.ts" />
/// <reference path="Wrapper/BlendEquationType.ts" />
/// <reference path="Wrapper/BlendFuncParamType.ts" />
/// <reference path="Wrapper/BufferTargetType.ts" />
/// <reference path="Wrapper/BufferUsageType.ts" />
/// <reference path="Wrapper/ClearTargetType.ts" />
/// <reference path="Wrapper/DepthFuncType.ts" />
/// <reference path="Wrapper/ElementType.ts" />
/// <reference path="Wrapper/FrameBufferAttachmentType.ts" />
/// <reference path="Wrapper/GLCullMode.ts" />
/// <reference path="Wrapper/GLFeatureType.ts" />
/// <reference path="Wrapper/GetParameterType.ts" />
/// <reference path="Wrapper/PrimitiveTopology.ts" />
/// <reference path="Wrapper/RBO/RBOInternalFormat.ts" />
/// <reference path="Wrapper/ShaderType.ts" />
/// <reference path="Wrapper/TargetTextureType.ts" />
/// <reference path="Wrapper/Texture/PixelStoreParamType.ts" />
/// <reference path="Wrapper/Texture/TexImageTargetType.ts" />
/// <reference path="Wrapper/Texture/TextureMagFilterType.ts" />
/// <reference path="Wrapper/Texture/TextureMinFilterType.ts" />
/// <reference path="Wrapper/Texture/TextureParameterType.ts" />
/// <reference path="Wrapper/Texture/TextureRegister.ts" />
/// <reference path="Wrapper/Texture/TextureWrapType.ts" />
/// <reference path="Wrapper/TextureInternalFormatType.ts" />
/// <reference path="Wrapper/TextureType.ts" />
/// <reference path="bundle-notdoc.ts" />
/// <reference path="jThree.ts" />


interface WebGLVertexArrayObjectExtension
{
  createVertexArrayOES();
  bindVertexArrayOES(vao:WebGLVertexArrayObject);
}

interface WebGLVertexArrayObject extends WebGLObject {
}

declare var WebGLVertexArrayObject: {
    prototype: WebGLVertexArrayObject;
    new(): WebGLVertexArrayObject;
}
