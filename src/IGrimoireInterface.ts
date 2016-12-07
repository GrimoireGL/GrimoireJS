import GomlNode from "./Node/GomlNode";
import GomlInterface from "./Interface/GomlInterface";
import IGrimoireInterfaceBase from "./IGrimoireInterfaceBase";
import IGomlInterface from "./Interface/IGomlInterface";
interface IGrimoireInterface extends IGrimoireInterfaceBase {
  (query: string | GomlNode[]): GomlInterface & IGomlInterface;
}

export default IGrimoireInterface;
