import GomlNode from "../Core/GomlNode";
import { GomlInterface, GrimoireInterface } from "../Tool/Types";
import Environment from "./Environment";
import GomlInterfaceImpl from "./GomlInterfaceImpl";
import GrimoireInterfaceImpl from "./GrimoireInterfaceImpl";

const context = new GrimoireInterfaceImpl();

function obtainGomlInterface(query: string): GomlInterface;
function obtainGomlInterface(query: GomlNode[]): GomlInterface;
function obtainGomlInterface(callback: () => void): void;
function obtainGomlInterface(this: GrimoireInterface, query: string | GomlNode[] | (() => void)): void | GomlInterface {
  if (typeof query === "string") {
    const gomlContext = new GomlInterfaceImpl(context.queryRootNodes(query));
    const queryFunc = gomlContext.queryFunc.bind(gomlContext);
    Object.setPrototypeOf(queryFunc, gomlContext);
    return queryFunc;
  } else if (typeof query === "function") {
    if ((obtainGomlInterface as any as GrimoireInterface).callInitializedAlready) {
      query();
    } else {
      (obtainGomlInterface as any as GrimoireInterface).initializedEventHandlers.push(query);
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
