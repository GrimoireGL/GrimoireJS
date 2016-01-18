import GomlNodeListElement = require("./GomlNodeListElement");
import JThreeObject = require("../Base/JThreeObject");
import EasingFunction = require("./Easing/EasingFunctionBase");
import AttributeConvrterBase = require("./Converter/AttributeConverterBase");
import GomlTreeNodeBase = require("./GomlTreeNodeBase");;
/**
 * Provides configurations that will be used when parse GOML.
 * These properties is intended to be used for extending by plugin feature.
 */
class GomlConfigurator extends JThreeObject {
  /**
   * List of easing function to indicate how animation will be.
   */
  private easingFunctions: {[key:string]:EasingFunction} = {};
  /**
   * List of converter function classes.
   */
  private converters: {[key:string]:AttributeConvrterBase} = {};
  /**
   * All list of goml tags that will be parsed and instanciated when parse GOML.
   *
   * Keyはタグ名の文字列(大文字)、ValueはGomlNodeのコンストラクタ
   */
  private gomlNodes: {[key:string]:GomlTreeNodeBase}= {};

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
  public getGomlNode(tagName: string): GomlTreeNodeBase {
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
    const list = require("./EasingFunctionList");
    for (var key in list) {
      var type = list[key];
      this.easingFunctions[key] =  new type();
    }
  }
  /**
   * Initialize converters from list.
   */
  private initializeConverters() {
    const list = require("./GomlConverterList");
    for (var key in list) {
      var type = list[key];
      this.converters[key] =  new type();
    }
  }

  /**
   * タグ名とNodeの関連付けを行っています。
   */
  private initializeGomlNodes() {
    var newList: GomlNodeListElement[] = require("./GomlNodeList");
    newList.forEach((v) => {
      for (var key in v.NodeTypes) {
        var keyInString: string = key;
        keyInString = keyInString.toUpperCase(); // transform into upper case
        var nodeType = v.NodeTypes[keyInString]; // nodeTypeはGomlNodeのコンストラクタ
        this.gomlNodes[keyInString] =  nodeType;
      }
    });
  }
}
export = GomlConfigurator;
