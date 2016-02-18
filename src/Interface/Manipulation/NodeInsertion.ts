import J3ObjectBase from "../J3ObjectBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import J3Object from "../J3Object";

class NodeInsertion extends J3ObjectBase {
  public append(content: string): J3Object;
  public append(content: GomlTreeNodeBase): J3Object;
  public append(content: J3Object): J3Object;
  public append(content: string[]): J3Object;
  public append(content: GomlTreeNodeBase[]): J3Object;
  public append(content: J3Object[]): J3Object;
  public append(content: any): J3Object {
    return;
  }
}
