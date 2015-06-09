import GomlNodeListElement = require("./GomlNodeListElement");

declare function require(string):any ;

var gomlList=[
  new GomlNodeListElement('jthree.geometries',
  require("./Factories/TagFactory"),
  {
    "TRI":require('./Nodes/Geometries/TriangleGeometryNode'),
    "GRID":require('./Nodes/Geometries/GridGeometryNode'),
    "CUBE":require('./Nodes/Geometries/CubeGeometryNode'),
    "CIRCLE":require('./Nodes/Geometries/CircleGeometryNode'),
    "CYLINDER":require('./Nodes/Geometries/CylinderGeometryNode')
  }),
  new GomlNodeListElement('jthree.basic',
  require("./Factories/TagFactory"),
  {
    "RENDERER":require('./Nodes/Renderers/RendererNode'),
    "VIEWPORT":require('./Nodes/Renderers/ViewPortNode'),
    "SCENE":require('./Nodes/SceneNode'),
  }),
  new GomlNodeListElement(
    'jthree.materials',
    require('./Factories/TagFactory'),
  {
    "SOLID":require('./Nodes/Materials/SolidColorNode'),
    "LAMBERT":require('./Nodes/Materials/LambertNode'),
    "PHONG":require('./Nodes/Materials/PhongNode')
  }),
  new GomlNodeListElement(
    'jthree.sceneobject',
    require('./Factories/SceneObjectTagFactory'),
  {
    "CAMERA":require('./Nodes/SceneObjects/Cameras/CameraNode'),
    "MESH":require('./Nodes/SceneObjects/MeshNode'),
    "OBJECT":require('./Nodes/SceneObjects/ObjectNode')
  }),
  new GomlNodeListElement("jthree.components",require('./Factories/TagFactory'),
  {
      "COMPONENTS":require('./Nodes/Components/ComponentsNode'),
  }),
  new GomlNodeListElement("jthree.component",require('./Factories/ComponentTagFactory'),
  {
      "COMPONENT":require('./Nodes/Components/ComponentNode')
  }),
  new GomlNodeListElement("jthree.template",require('./Factories/TemplateTagFactory'),
    {
      "TEMPLATE":require('./Nodes/Templates/TemplateNode')
    })
];
export=gomlList;
