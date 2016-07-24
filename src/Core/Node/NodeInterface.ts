import ComponentInterface from "./ComponentInterface";
interface NodeInterface {
    (query: string): ComponentInterface;
}
export default NodeInterface;
