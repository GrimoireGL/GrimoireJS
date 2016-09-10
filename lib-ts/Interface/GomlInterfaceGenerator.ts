import GomlInterface from "./GomlInterface";
import IGomlInterface from "./IGomlInterface";
import GomlNode from "../Node/GomlNode";
export default function(rootNodes: GomlNode[]): IGomlInterface {
  const gomlContext = new GomlInterface(rootNodes);
  const queryFunc = gomlContext.queryFunc.bind(gomlContext);
  Object.setPrototypeOf(queryFunc, gomlContext);
  return queryFunc as IGomlInterface;
}
