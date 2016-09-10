import INodeInterface from "./INodeInterface";
import IGomlInterfaceBase from "./IGomlInterfaceBase";

interface IGomlInterface extends IGomlInterfaceBase {
    (query: string): INodeInterface;
}

export default IGomlInterface;
