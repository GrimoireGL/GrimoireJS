import VertexMorph = require("./Morphs/VertexMorph");
import UVMorph = require("./Morphs/UVMorph");
import BoneMorph = require("./Morphs/BoneMorph");
import MaterialMorph = require("./Morphs/MaterialMorph");
import GroupMorph = require("./Morphs/GroupMorph");

interface PMXMorph {
  morphName: string;
  morphNameEn: string;
  editPanel: number;
  morphKind: number;
  morphOffsetCount: number;
  vertexMorph?: VertexMorph[];
  uvMorph?: UVMorph[];
  boneMorph?: BoneMorph[];
  materialMorph?: MaterialMorph[];
  groupMorph?: GroupMorph[];
}

export = PMXMorph;
