import VertexMorph from "./Morphs/VertexMorphData";
import UVMorph from "./Morphs/UVMorphData";
import BoneMorph from "./Morphs/BoneMorphData";
import MaterialMorph from "./Morphs/MaterialMorphData";
import GroupMorph from "./Morphs/GroupMorphData";

interface PMXMorphData {
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

export default PMXMorphData;
