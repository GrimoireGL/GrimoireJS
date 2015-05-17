import GomlNodeListElement = require("./GomlNodeListElement");
import GomlTagLoader = require("./GomlTagBase");

declare function require(string):any ;

var gomlList=[
  new GomlNodeListElement('default',GomlTagLoader,{
    "TRI":require('./Nodes/GomlTreeTriNode'),
    "RDR":require('./Nodes/GomlTreeRdrNode'),
    "VP":require('./Nodes/GomlTreeVpNode'),
    "SCENE":require('./Nodes/GomlTreeSceneNode')
  }),
  new GomlNodeListElement('scene',require('./Tags/GomlSceneObjectTagBase'),
  {
    "CAMERA":require('./Nodes/GomlTreeCameraNode'),
    "MESH":require('./Nodes/GomlTreeMeshNode')
  })
];
export=gomlList;
