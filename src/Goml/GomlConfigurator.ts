import GomlNodeListElement from "./GomlNodeListElement";
import JThreeObject from "../Base/JThreeObject";
import EasingFunction from "./Easing/EasingFunctionBase";
import AttributeConvrterBase from "./Converter/AttributeConverterBase";
import GomlTreeNodeBase from "./GomlTreeNodeBase";
import EasingFunctionList from "./EasingFunctionList";
import GomlConverterList from "./GomlConverterList";
import GomlNodeList from "./GomlNodeList";
/**
 * Provides configurations that will be used when parse GOML.
 * These properties is intended to be used for extending by plugin feature.
 */
class GomlConfigurator extends JThreeObject {
  /**
   * List of easing function to indicate how animation will be.
   */
  private easingFunctions: { [key: string]: EasingFunction } = {};
  /**
   * List of converter function classes.
   */
  private converters: { [key: string]: AttributeConvrterBase } = {};
  /**
   * All list of goml tags that will be parsed and instanciated when parse GOML.
   *
   * Keyはタグ名の文字列(大文字)、ValueはGomlNodeのコンストラクタ
   */
  private gomlNodes: { [key: string]: new () => GomlTreeNodeBase } = {};

  public getConverter(name: string): AttributeConvrterBase {
    return this.converters[name];
  }

  public getEasingFunction(name: string): EasingFunction {
    return this.easingFunctions[name];
  }

  /**
   * タグ名からGomlNodeを取得します
   *
   * @param  {string} tagName タグ名
   * @return {GomlTreeNodeBase}
   */
  public getGomlNode(tagName: string): new () => GomlTreeNodeBase {
    return this.gomlNodes[tagName.toUpperCase()];
  }

  /**
   * `TagFactory`, `Converter`の定義を行っています
   *
   * `TagFactory`はNodeを生成するために必要です。ここではタグ名とTagFactoryの関連付けを行っております。
   */
  constructor() {
    super();
    this.initializeEasingFunctions();
    this.initializeConverters();
    this.initializeGomlNodes();
  }

  /*
  * Initialize associative array for easing functions that will be used for animation in goml.
  */
  private initializeEasingFunctions() {
    const list = EasingFunctionList;
    for (let key in list) {
      const type = list[key];
      this.easingFunctions[key] = new type();
    }
  }
  /**
   * Initialize converters from list.
   */
  private initializeConverters() {
    const list = GomlConverterList;
    for (let key in list) {
      const type = list[key];
      this.converters[key] = new type();
    }
  }

  /**
   * タグ名とNodeの関連付けを行っています。
   */
  private initializeGomlNodes() {
    const newList: GomlNodeListElement[] = GomlNodeList;
    newList.forEach((v) => {
      for (let key in v.NodeTypes) {
        let keyInString: string = key;
        keyInString = keyInString.toUpperCase(); // transform into upper case
        const nodeType = v.NodeTypes[keyInString]; // nodeTypeはGomlNodeのコンストラクタ
        this.gomlNodes[keyInString] = nodeType;
      }
    });
  }
}
export default GomlConfigurator;
