import NodeInterface from "./NodeInterface";

interface IGOMLInterface extends IGOMLInterfaceBase {
    (query: string): NodeInterface;
}

interface IGOMLInterfaceBase {
}
class GOMLInterface implements IGOMLInterfaceBase {
}

export default GOMLInterface;
