import GomlTreeNodeBase from "../Goml/GomlTreeNodeBase";
import ModuleInstanceRegistry from "./ModuleInstanceRegistry";

interface IModule {
  start?: (node: GomlTreeNodeBase) => void;
  terminate?: (node: GomlTreeNodeBase) => void;
  update?: (node: GomlTreeNodeBase) => void;
  enabled?: boolean;
  __init__: (registry: ModuleInstanceRegistry) => void;
  __registry__: ModuleInstanceRegistry;
  detach: () => void;
  initialize: () => void;
}

export default IModule;
