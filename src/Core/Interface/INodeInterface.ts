import IComponentInterface from "./IComponentInterface";
import INodeInterfaceBase from "./INodeInterfaceBase";


interface INodeInterface extends INodeInterfaceBase {
  (query: string): IComponentInterface;
}


export default INodeInterface;
