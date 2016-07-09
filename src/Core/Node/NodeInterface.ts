import ComponentInterface from "./Component/ComponentInterface";
interface NodeInterface {
    (query: string): ComponentInterface;
}
export default NodeInterface;
