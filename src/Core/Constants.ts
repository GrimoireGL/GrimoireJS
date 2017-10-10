/**
 * define Constants
 */
export default class Constants {
  /**
   * default namespace
   */
  public static get defaultNamespace(): string {
    return "grimoirejs";
  }

  /**
   * id key for node.
   */
  public static get x_gr_id(): string {
    return "x-gr-id";
  }

  /**
   * base node name
   */
  public static get baseNodeName(): string {
    return Constants.defaultNamespace + ".grimoire-node-base";
  }
}
