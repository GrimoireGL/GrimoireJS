import GomlNodeListElement = require("./GomlNodeListElement");

declare function require(string):any ;

var gomlList=[
  new GomlNodeListElement('jthree.geometries',
  require("./Factories/TagFactory"),
  {
    "TRI":require('./Nodes/Geometries/TriangleGeometryNode'),
    "GRID":require('./Nodes/Geometries/GridGeometryNode')
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
  }),
  new GomlNodeListElement(
    'jthree.sceneobject',
    require('./Factories/SceneObjectTagFactory'),
  {
    "CAMERA":require('./Nodes/SceneObjects/Cameras/CameraNode'),
    "MESH":require('./Nodes/SceneObjects/MeshNode')
  })
];
export=gomlList;
