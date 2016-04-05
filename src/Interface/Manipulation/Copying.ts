import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import isUndefined from "lodash.isundefined";
import NodeOperation from "../Static/NodeOperation";

class Copying extends J3ObjectBase {
  public clone(): J3Object;
  public clone(withEvents: boolean): J3Object;
  public clone(withEvents: boolean, deepWithEvents: boolean): J3Object;
  public clone(argu0?: any, argu1?: any): J3Object {
    let withEvents = false;
    let deepWithEvents = false;
    switch (true) {
      case isUndefined(argu0):
        break;
      case (argu0 === true || argu0 === false):
        withEvents = argu0;
        switch (true) {
          case isUndefined(argu1):
            deepWithEvents = withEvents;
            break;
          case (argu1 === true || argu1 === false):
            deepWithEvents = argu1;
            break;
          default:
            throw new Error("Argument type is not correct");
        }
        break;
      default:
        throw new Error("Argument type is not correct");
    }
    return new J3Object(NodeOperation.clone(this.__getArray(), withEvents, deepWithEvents));
  }
}

export default Copying;
