import GrimoireInterfaceImpl from "./GrimoireInterfaceImpl";
import GomlInterfaceImpl from "./GomlInterfaceImpl";
import GomlNode from "../Node/GomlNode";
import {GomlInterface, GrimoireInterface} from "../Base/Types";


const context = new GrimoireInterfaceImpl();

function obtainGomlInterface(query: string): GomlInterface;
function obtainGomlInterface(query: GomlNode[]): GomlInterface;
function obtainGomlInterface(callback: (scriptTags: HTMLScriptElement[]) => void): void;
function obtainGomlInterface(query: string | GomlNode[] | ((scriptTags: HTMLScriptElement[]) => void)): void | GomlInterface {
  if (typeof query === "string") {
    const gomlContext = new GomlInterfaceImpl(context.queryRootNodes(query));
    const queryFunc = gomlContext.queryFunc.bind(gomlContext);
    Object.setPrototypeOf(queryFunc, gomlContext);
    return queryFunc;
  } else if (typeof query === "function") {
    context.initializedEventHandler.push(query);
  } else {
    const gomlContext = new GomlInterfaceImpl(query);
    const queryFunc = gomlContext.queryFunc.bind(gomlContext);
    Object.setPrototypeOf(queryFunc, gomlContext);
    return queryFunc;
  }
}
Object.setPrototypeOf(obtainGomlInterface, context);
export default obtainGomlInterface as GrimoireInterface;
