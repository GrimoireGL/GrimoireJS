import GomlNode from "./Node/GomlNode";
import GomlInterface from "./Interface/GomlInterface";
import IGomlInterface from "./Interface/IGomlInterface";
interface IGrimoireInterface {
  (query: string | GomlNode[]): GomlInterface & IGomlInterface;
}

export default IGrimoireInterface;
