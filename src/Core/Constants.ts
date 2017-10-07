export default class Constants {
  public static get defaultNamespace(): string {
    return "grimoirejs";
  }
  public static get x_gr_id(): string {
    return "x-gr-id";
  }

  public static get baseNodeName(): string {
    return Constants.defaultNamespace + ".grimoire-node-base";
  }
}
