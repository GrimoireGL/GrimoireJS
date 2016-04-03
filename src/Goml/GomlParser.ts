import GomlTreeNodeBase from "./GomlTreeNodeBase";
import GomlConfigurator from "./GomlConfigurator";
import GomlAttribute from "./GomlAttribute";

/**
 * Parser of Goml to Node utilities.
 * This class do not store any nodes and goml properties.
 */
class GomlParser {
  /**
   * Parse Goml to Node
   * @param {HTMLElement} soruce [description]
   */
  public static parse(soruce: HTMLElement, configurator: GomlConfigurator): GomlTreeNodeBase {
    return GomlParser.parseChild(soruce, configurator);
  }

  public static parseChild(child: HTMLElement, configurator: GomlConfigurator): GomlTreeNodeBase {
    // obtain factory class for the node
    const elem: HTMLElement = <HTMLElement>child;
    const newNode = GomlParser._createNode(elem, configurator);
    // タグ名が無効、又はattibuteが無効だった場合にはパースはキャンセルされる。HTMLElement側のattrにparseされていないことを記述
    if (newNode) {
      // call this function recursive
      const children = elem.childNodes;
      if (children && children.length !== 0) {
        for (let i = 0; i < children.length; i++) {
          if (children[i].nodeType !== 1) {
            continue;
          }
          // generate instances for every children nodes
          const e = <HTMLElement>children[i];
          const newChildNode = GomlParser.parseChild(e, configurator);
          if (newChildNode) {
            newNode.addChild(newChildNode);
          }
        }
      }
      // console.log("parseChild finish:", newNode);
      return newNode;
    } else {
      // when specified node could not be found
      console.warn(`"${elem.tagName}" was not parsed.`);
      return null;
    }
  }

  /**
   * GomlNodeの生成、初期化を行います。
   *
   * GomlNodeの生成のライフサイクルを定義しています。
   * @param  {HTMLElement}      elem         [description]
   * @param  {GomlConfigurator} configurator [description]
   * @return {GomlTreeNodeBase}              [description]
   */
  private static _createNode(elem: HTMLElement, configurator: GomlConfigurator): GomlTreeNodeBase {
    // console.log("START");
    const tagName = elem.tagName;
    // console.log(`createNode: ${tagName}`);
    const nodeType = configurator.getGomlNode(tagName);
    /**
     * インスタンス生成
     * それぞれのGomlNodeのattributeの定義、attribute更新時のイベント、child, parent更新時のイベントの定義
     */
    if (nodeType === undefined) {
      throw new Error(`Tag ${tagName} is not found.`);
      // Process is cut off here.
      // This will be deal by pass or create mock instance.
    }
    const newNode = new nodeType();
    /**
     * HTMLElementのattributeとのバインディング
     *
     * Nodeの必須Attributes一覧を取得し、HTMLElementに存在しなければ追加。
     * HTMLElementのすべてのattributesを取得し、NodeのAttributesに反映。なかった場合にはreserveする。
     */
    // console.log(elem.outerHTML);
    newNode.attributes.forEachAttr((attr, key) => {
      if (!elem.getAttribute(key)) {
        // console.log("add essential attr:", key, attr.ValueStr, attr.Value);
        elem.setAttribute(key, attr.ValueStr);
      }
    });
    for (let i = 0; i <= elem.attributes.length - 1; i++) {
      let attr = elem.attributes[i];
      ((attr_: Node) => {
        const attrKey = attr_.nodeName;
        const attrValue = attr_.nodeValue;
        let gomlAttribute = newNode.attributes.getAttribute(attrKey);
        // console.log("attribute_binding", attrKey, attrValue, gomlAttribute);
        if (!gomlAttribute) {
          gomlAttribute = newNode.attributes.reserveAttribute(attrKey, attrValue);
        } else {
          gomlAttribute.Value = attrValue;
        }
        gomlAttribute.on("changed", (ga: GomlAttribute) => {
          elem.setAttribute(attrKey, ga.ValueStr);
        });
      })(attr);
    }
    newNode.props.setProp<HTMLElement>("elem", elem);
    elem.setAttribute("x-j3-id", newNode.id);
    // console.log("END");
    return newNode;
  }
}

export default GomlParser;
