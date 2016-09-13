import IGrimoireInterfaceBase from "./IGrimoireInterfaceBase";
import IGomlInterface from "./Interface/IGomlInterface";
interface IGrimoireInterface extends IGrimoireInterfaceBase {
  (query: string): IGomlInterface;
}

export default IGrimoireInterface;
