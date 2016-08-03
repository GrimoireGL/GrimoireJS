import GomlNode from "../Node/GomlNode";
import IGomlInterfaceBase from "./IGomlInterfaceBase";
/**
 * Provides interfaces to treat whole goml tree for each.
 */
class GomlInterface implements IGomlInterfaceBase {
    constructor(public rootNodes: GomlNode[]) {

    }

    queryFunc(query: string): void {

    }
}

export default GomlInterface;
