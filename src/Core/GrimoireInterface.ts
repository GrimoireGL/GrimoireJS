import GomlNode from "../Core/GomlNode";
import { GomlInterface, GrimoireInterface } from "../Tools/Types";
import Environment from "./Environment";
import GomlInterfaceImpl from "./GomlInterfaceImpl";
import GrimoireInterfaceImpl from "./GrimoireInterfaceImpl";

const context = new GrimoireInterfaceImpl();

function obtainGomlInterface(query: string): GomlInterface;
function obtainGomlInterface(query: GomlNode[]): GomlInterface;
function obtainGomlInterface(callback: () => void): void;
function obtainGomlInterface(query: string | GomlNode[] | (() => void)): void | GomlInterface {
  if (typeof query === "string") {
    const gomlContext = new GomlInterfaceImpl(context.queryRootNodes(query));
    const queryFunc = gomlContext.queryFunc.bind(gomlContext);
    Object.setPrototypeOf(queryFunc, gomlContext);
    return queryFunc;
  } else if (typeof query === "function") {
    if (context.callInitializedAlready) {
      query();
    } else {
      context.initializedEventHandler.push(query);
    }
  } else {
    const gomlContext = new GomlInterfaceImpl(query);
    const queryFunc = gomlContext.queryFunc.bind(gomlContext);
    Object.setPrototypeOf(queryFunc, gomlContext);
    return queryFunc;
  }
}
Object.setPrototypeOf(obtainGomlInterface, context);
Environment.GrimoireInterface = obtainGomlInterface as GrimoireInterface;
export default obtainGomlInterface as GrimoireInterface;
