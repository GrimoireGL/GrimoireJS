import GrimoireInterfaceImpl from "./GrimoireInterfaceImpl";
import GomlInterface from "./Interface/GomlInterface";
import IGomlInterface from "./Interface/IGomlInterface";
import GomlNode from "./Node/GomlNode";

type IGrimoireInterface = {
  (query: string): GomlInterface & IGomlInterface;
  (query: GomlNode[]): GomlInterface & IGomlInterface;
  (callback: Function): void;
};

const context = new GrimoireInterfaceImpl();
const obtainGomlInterface = function(query: string | GomlNode[] | ((scriptTags: HTMLScriptElement[]) => void)): GomlInterface & IGomlInterface {
  if (typeof query === "string") {
    // return GomlInterfaceGenerator(context.queryRootNodes(query));
    const gomlContext = new GomlInterface(context.queryRootNodes(query));
    const queryFunc = gomlContext.queryFunc.bind(gomlContext);
    Object.setPrototypeOf(queryFunc, gomlContext);
    return queryFunc;
  } else if (typeof query === "function") {
    context.initializedEventHandler.push(query);
  } else {
    const gomlContext = new GomlInterface(query);
    const queryFunc = gomlContext.queryFunc.bind(gomlContext);
    Object.setPrototypeOf(queryFunc, gomlContext);
    return queryFunc;
  }
};
// const bindedFunction = obtainGomlInterface.bind(context);
Object.setPrototypeOf(obtainGomlInterface, context);
export default obtainGomlInterface as IGrimoireInterface & GrimoireInterfaceImpl;
