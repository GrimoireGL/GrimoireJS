import NodeInterface from "./NodeInterface";

interface IGomlInterface extends IGomlInterfaceBase {
    (query: string): NodeInterface;
}

interface IGomlInterfaceBase {
}
class GomlInterface implements IGomlInterfaceBase {
}

export default GomlInterface;
