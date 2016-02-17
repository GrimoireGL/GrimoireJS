import VertexMorph from "./Morphs/VertexMorph";
import UVMorph from "./Morphs/UVMorph";
import BoneMorph from "./Morphs/BoneMorph";
import MaterialMorph from "./Morphs/MaterialMorph";
import GroupMorph from "./Morphs/GroupMorph";

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

export default PMXMorph;
