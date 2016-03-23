import GomlNodeListElement from "./GomlNodeListElement";
import JThreeObject from "../Base/JThreeObject";
import AttributeConvrterBase from "./Converter/AttributeConverterBase";
import GomlTreeNodeBase from "./GomlTreeNodeBase";
import GomlConverterList from "./GomlConverterList";
import GomlNodeList from "./GomlNodeList";
/**
 * Provides configurations that will be used when parse GOML.
 * These properties is intended to be used for extending by plugin feature.
 */
class GomlConfigurator extends JThreeObject {
  /**
   * List of converter function classes.
   */
  private _converters: { [key: string]: AttributeConvrterBase } = {};
  /**
   * All list of goml tags that will be parsed and instanciated when parse GOML.
   *
   * Keyはタグ名の文字列(大文字)、ValueはGomlNodeのコンストラクタ
   */
  private _gomlNodes: { [key: string]: new () => GomlTreeNodeBase } = {};

  public getConverter(name: string): AttributeConvrterBase {
    return this._converters[name];
  }

  /**
   * タグ名からGomlNodeを取得します
   *
   * @param  {string} tagName タグ名
   * @return {GomlTreeNodeBase}
   */
  public getGomlNode(tagName: string): new () => GomlTreeNodeBase {
    return this._gomlNodes[tagName.toUpperCase()];
  }

  /**
   * `TagFactory`, `Converter`の定義を行っています
   *
   * `TagFactory`はNodeを生成するために必要です。ここではタグ名とTagFactoryの関連付けを行っております。
   */
  constructor() {
    super();
    this._initializeConverters();
    this._initializeGomlNodes();
  }

  /**
   * Initialize converters from list.
   */
  private _initializeConverters(): void {
    const list = GomlConverterList;
    for (let key in list) {
      const type = list[key];
      this._converters[key] = new type();
      this._converters[key].name = key;
    }
  }

  /**
   * タグ名とNodeの関連付けを行っています。
   */
  private _initializeGomlNodes(): void {
    const newList: GomlNodeListElement[] = GomlNodeList;
    newList.forEach((v) => {
      for (let key in v.NodeTypes) {
        let keyInString: string = key;
        keyInString = keyInString.toUpperCase(); // transform into upper case
        const nodeType = v.NodeTypes[keyInString]; // nodeTypeはGomlNodeのコンストラクタ
        this._gomlNodes[keyInString] = nodeType;
      }
    });
  }
}
export default GomlConfigurator;
