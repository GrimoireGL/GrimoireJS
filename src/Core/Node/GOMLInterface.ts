import GOMLTree from "./GOMLTree";
import NodeInterface from "./NodeInterface";

interface IGOMLInterface extends IGOMLInterfaceBase {
    (query: string): NodeInterface;
}

interface IGOMLInterfaceBase {
    trees: GOMLTree[];
}
class GOMLInterface implements IGOMLInterfaceBase {
    public trees: GOMLTree[];
}

export default GOMLInterface;
