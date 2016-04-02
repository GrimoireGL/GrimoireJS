import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import SomeToNodes from "./SomeToNodes";

class Filter {
  public static filter(target: GomlTreeNodeBase[], filter: any, filterType: string[], block?: (node: GomlTreeNodeBase, index: number, filter: GomlTreeNodeBase[]) => boolean): GomlTreeNodeBase[] {
    let filterNodes = SomeToNodes.convert(filter, filterType);
    filterNodes = filterNodes === null ? [] : filterNodes;
    if (block) {
      return target.filter((node, i) => {
        return block(node, i, filterNodes);
      });
    } else {
      return target.filter((t) => {
        return filterNodes.indexOf(t) !== -1;
      });
    }
  }
}

export default Filter;
