import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import SomeToNodes from "./SomeToNodes";

class Filter {
  public static filter(target: GomlTreeNodeBase[], filter: any, filterType: string[]) {
    let filterNodes = SomeToNodes.convert(filter, filterType);
    filterNodes = filterNodes === null ? [] : filterNodes;
    return target.filter((t) => {
      return filterNodes.indexOf(t) === -1;
    });
  }
}

export default Filter;
