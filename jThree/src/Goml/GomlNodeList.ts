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
    "RDR":require('./Nodes/Renderers/RendererNode'),
    "VP":require('./Nodes/Renderers/ViewPortNode'),
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
  new GomlNodeListElement("jthree.modules",require('./Factories/TagFactory'),
  {
      "MODULES":require('./Nodes/Modules/ModulesNode'),
  }),
  new GomlNodeListElement("jthree.module",require('./Factories/ModuleTagFactory'),
  {
      "MODULE":require('./Nodes/Modules/ModuleNode')
  }
  )
];
export=gomlList;
