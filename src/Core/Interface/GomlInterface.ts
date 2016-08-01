import GomlNode from "../Node/GomlNode";
import IGomlInterfaceBase from "./IGomlInterfaceBase";

class GomlInterface implements IGomlInterfaceBase {
    constructor(public rootNodes: GomlNode[]) {

    }
}

export default GomlInterface;
