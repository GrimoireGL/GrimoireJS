import GomlTreeNodeBase from "./GomlTreeNodeBase";
/**
 * The goml node relating to any core object.
 */
class CoreRelatedNodeBase<T> extends GomlTreeNodeBase {
  /**
   * Related core object
   * @type {T}
   */
  public target: T;
}

export default CoreRelatedNodeBase;
