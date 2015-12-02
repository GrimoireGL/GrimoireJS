import GomlNodeListElement = require("./GomlNodeListElement");

declare function require(string): any;

var gomlList = [  new GomlNodeListElement("jthree.toplevel",
    {
      "CANVASES": require("./Nodes/TopLevel/CanvasesNode"),
      "RESOURCES": require("./Nodes/TopLevel/ResourcesNode"),
      "SCENES": require("./Nodes/TopLevel/ScenesNode"),
      "TEMPLATES": require("./Nodes/TopLevel/TemplatesNode"),
      "LOADERS":require("./Nodes/TopLevel/LoadersNode"),
      "GOML":require("./Nodes/TopLevel/GomlNode")
    }),
  new GomlNodeListElement("jthree.geometries",
    {
      "TRI": require("./Nodes/Geometries/TriangleGeometryNode"),
      "GRID": require("./Nodes/Geometries/GridGeometryNode"),
      "CUBE": require("./Nodes/Geometries/CubeGeometryNode"),
      "CIRCLE": require("./Nodes/Geometries/CircleGeometryNode"),
      "CYLINDER": require("./Nodes/Geometries/CylinderGeometryNode"),
      "QUAD": require("./Nodes/Geometries/QuadGeometryNode")
    }),
  new GomlNodeListElement("jthree.basic",
    {
      "CANVAS": require("./Nodes/Canvases/CanvasNode"),
      "VIEWPORT": require("./Nodes/Renderers/ViewPortNode"),
      "SCENE": require("./Nodes/SceneNode"),
    }),
  new GomlNodeListElement(
    "jthree.materials",
    {
      "SOLID": require("./Nodes/Materials/SolidColorNode"),
      "PHONG": require("./Nodes/Materials/PhongNode"),
      "SPRITE": require("./Nodes/Materials/SpriteNode"),
      "DDEBUG": require("./Nodes/Materials/DefferedDebugNode"),
      "TDEBUG": require("./Nodes/Materials/TextureDebugNode")
    }),
  new GomlNodeListElement(
    "jthree.sceneobject",
    {
      "CAMERA": require("./Nodes/SceneObjects/Cameras/CameraNode"),
      "OCAMERA": require("./Nodes/SceneObjects/Cameras/OrthoCameraNode"),
      "MESH": require("./Nodes/SceneObjects/MeshNode"),
      "OBJECT": require("./Nodes/SceneObjects/ObjectNode"),
      "PLIGHT": require("./Nodes/SceneObjects/Lights/PointLightNode"),
      "DLIGHT": require("./Nodes/SceneObjects/Lights/DirectionalLightNode"),
      "ALIGHT" : require("./Nodes/SceneObjects/Lights/AreaLightNode"),
      "SLIGHT" :require("./Nodes/SceneObjects/Lights/SpotLightNode"),
      "SCENELIGHT" : require('./Nodes/SceneObjects/Lights/SceneLightNode'),
      "PMX": require("../PMX/Goml/PMXNode")
    }),
  new GomlNodeListElement(
      "jthree.textures",
      {
          "TEXTURE": require("./Nodes/Texture/TextureNode"),
          "CUBETEXTURE":require("./Nodes/Texture/CubeTextureNode")
      }),
  new GomlNodeListElement("jthree.behaviors",
    {
      "BEHAVIORS": require("./Nodes/Behaviors/BehaviorsNode"),
    }),
  new GomlNodeListElement("jthree.behavior",
    {
      "BEHAVIOR": require("./Nodes/Behaviors/BehaviorNode")
    }),
  new GomlNodeListElement("jthree.template",
    {
      "TEMPLATE": require("./Nodes/Templates/TemplateNode")
    }),
    new GomlNodeListElement("jthree.loader",
  {
    "LOADER":require("./Nodes/Loaders/LoaderNode")
  }),
  new GomlNodeListElement("jthree.pmx.morph",
    {
      "MORPH": require("../PMX/Goml/PMXMorphNode"),
    }),
    new GomlNodeListElement("jthree.pmx.bone",
    {
      "BONE": require("../PMX/Goml/PMXBoneNode"),
    }),
  new GomlNodeListElement("jthree.pmx.contents",
    {
      "MORPHS": require("../PMX/Goml/PMXMorphsNode"),
      "BONES": require("../PMX/Goml/PMXBonesNode"),
      "VMD":require("../VMD/Goml/VMDNode")
    })
];
export =gomlList;
