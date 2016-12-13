import GomlNode from "../Node/GomlNode";
import ComponentInterface from "./ComponentInterface";


interface INodeInterface {
  (query: string): ComponentInterface;
}


export default INodeInterface;
