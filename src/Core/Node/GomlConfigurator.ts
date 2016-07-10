import AttributeConvrter from "./AttributeConverter";
import ConverterList from "./Converters/ConverterList";
import GomlNodeList from "./GomlNodeList";
import NodeRecipe from "./NodeRecipe";
import ComponentBase from "./ComponentBase";
import ComponentList from "./Component/ComponentList";

/**
 * Provides configurations that will be used when parse GOML.
 * These properties is intended to be used for extending by plugin feature.
 */
class GomlConfigurator {

  private static _instance: GomlConfigurator;
  /**
   * List of converter function classes.
   */
  private _converters: { [key: string]: AttributeConvrter } = {};
  /**
   * All list of goml tags that will be parsed and instanciated when parse GOML.
   *
   * Keyはタグ名の文字列(大文字)、ValueはGomlNodeのコンストラクタ
   */
  private _gomlNodes: { [key: string]: NodeRecipe } = {};

  private _components: { [key: string]: ComponentBase} = {};

  public static get Instance(): GomlConfigurator {
    if (!this._instance) {
      this._instance = new GomlConfigurator();
    }
    return this._instance;
  }

  public getConverter(name: string): AttributeConvrter {
    return this._converters[name];
  }

  /**
   * タグ名からGomlNodeを取得します
   *
   * @param  {string} tagName タグ名
   * @return {GomlTreeNodeBase}
   */
  public getGomlNode(tagName: string): NodeRecipe {
    return this._gomlNodes[tagName.toUpperCase()];
  }

  public getComponent(name: string): ComponentBase {
    return this._components[name];
  }

  /**
   * `TagFactory`, `Converter`の定義を行っています
   *
   * `TagFactory`はNodeを生成するために必要です。ここではタグ名とTagFactoryの関連付けを行っております。
   */
  constructor() {
    this._initializeConverters();
    this._initializeGomlNodes();
    this._initializeComponents();
  }

  /**
   * Initialize converters from list.
   */
  private _initializeConverters(): void {
    const list = ConverterList;
    for (let key in list) {
      const type = list[key];
      this._converters[key] = new type();
    }
  }

  /**
   * タグ名とNodeの関連付けを行っています。
   */
  private _initializeGomlNodes(): void {
    const list = GomlNodeList;
    for (let key in list) {
      let keyInString: string = key.toUpperCase(); // transform into upper case
      const nodeType = list[key]; // nodeTypeはGomlNodeのコンストラクタ
      this._gomlNodes[keyInString] = nodeType;
    }
  }

  private _initializeComponents(): void {
    const list = ComponentList;
    for (let key in list) {
      const componentType = list[key];
      this._components[key] = new componentType();
    }
  }
}
export default GomlConfigurator;
