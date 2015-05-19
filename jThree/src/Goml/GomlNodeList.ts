import GomlNodeListElement = require("./GomlNodeListElement");

declare function require(string):any ;

var gomlList=[
  new GomlNodeListElement('default',require("./Factories/TagFactory"),{
    "TRI":require('./Nodes/GomlTreeTriNode'),
    "RDR":require('./Nodes/GomlTreeRdrNode'),
    "VP":require('./Nodes/GomlTreeVpNode'),
    "SCENE":require('./Nodes/GomlTreeSceneNode'),
    "SOLID":require('./Nodes/Materials/SolidColorNode'),
    "GRID":require('./Nodes/Geometries/GridGeometryNode')
  }),
  new GomlNodeListElement('scene',require('./Factories/SceneObjectTagFactory'),
  {
    "CAMERA":require('./Nodes/GomlTreeCameraNode'),
    "MESH":require('./Nodes/GomlTreeMeshNode')
  })
];
export=gomlList;
