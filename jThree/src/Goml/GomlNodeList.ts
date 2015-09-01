import GomlNodeListElement = require("./GomlNodeListElement");

declare function require(string): any;

var gomlList = [
  new GomlNodeListElement("jthree.geometries",
    require("./Factories/TagFactory"),
    {
      "TRI": require("./Nodes/Geometries/TriangleGeometryNode"),
      "GRID": require("./Nodes/Geometries/GridGeometryNode"),
      "CUBE": require("./Nodes/Geometries/CubeGeometryNode"),
      "CIRCLE": require("./Nodes/Geometries/CircleGeometryNode"),
      "CYLINDER": require("./Nodes/Geometries/CylinderGeometryNode"),
      "QUAD": require("./Nodes/Geometries/QuadGeometryNode")
    }),
  new GomlNodeListElement("jthree.basic",
    require("./Factories/TagFactory"),
    {
      "RENDERER": require("./Nodes/Renderers/RendererNode"),
      "VIEWPORT": require("./Nodes/Renderers/ViewPortNode"),
      "SCENE": require("./Nodes/SceneNode"),
    }),
  new GomlNodeListElement(
    "jthree.materials",
    require("./Factories/TagFactory"),
    {
      "SOLID": require("./Nodes/Materials/SolidColorNode"),
      "LAMBERT": require("./Nodes/Materials/LambertNode"),
      "PHONG": require("./Nodes/Materials/PhongNode"),
      "SPRITE": require("./Nodes/Materials/SpriteNode"),
      "DDEBUG": require("./Nodes/Materials/DefferedDebugNode"),
      "TDEBUG": require("./Nodes/Materials/TextureDebugNode")
    }),
  new GomlNodeListElement(
    "jthree.sceneobject",
    require("./Factories/SceneObjectTagFactory"),
    {
      "CAMERA": require("./Nodes/SceneObjects/Cameras/CameraNode"),
      "OCAMERA": require("./Nodes/SceneObjects/Cameras/OrthoCameraNode"),
      "MESH": require("./Nodes/SceneObjects/MeshNode"),
      "OBJECT": require("./Nodes/SceneObjects/ObjectNode"),
      "PLIGHT": require("./Nodes/SceneObjects/Lights/PointLightNode"),
      "DLIGHT": require("./Nodes/SceneObjects/Lights/DirectionalLightNode"),
      "PMX": require("../PMX/Goml/PMXNode")
    }),
  new GomlNodeListElement(
      "jthree.textures",
      require("./Factories/TagFactory"),
      {
          "TEXTURE": require("./Nodes/Texture/TextureNode"),
          "CUBETEXTURE":require("./Nodes/Texture/CubeTextureNode")
      }),
  new GomlNodeListElement("jthree.behaviors", require("./Factories/TagFactory"),
    {
      "BEHAVIORS": require("./Nodes/Behaviors/BehaviorsNode"),
    }),
  new GomlNodeListElement("jthree.behavior", require("./Factories/BehaviorTagFactory"),
    {
      "BEHAVIOR": require("./Nodes/Behaviors/BehaviorNode")
    }),
  new GomlNodeListElement("jthree.template", require("./Factories/TemplateTagFactory"),
    {
      "TEMPLATE": require("./Nodes/Templates/TemplateNode")
    }),
  new GomlNodeListElement("jthree.pmx.morph", require("../PMX/Goml/Factory/PMXMorphTagFactory"),
    {
      "MORPH": require("../PMX/Goml/PMXMorphNode"),
    }),
    new GomlNodeListElement("jthree.pmx.bone", require("../PMX/Goml/Factory/PMXBoneTagFactory"),
    {
      "BONE": require("../PMX/Goml/PMXBoneNode"),
    }),
  new GomlNodeListElement("jthree.pmx.contents", require("./Factories/TagFactory"),
    {
      "MORPHS": require("../PMX/Goml/PMXMorphsNode"),
      "BONES": require("../PMX/Goml/PMXBonesNode"),
      "VMD":require("../VMD/Goml/VMDNode")
    })
];
export =gomlList;
