import GomlConfigurator from "./GomlConfigurator";
import GomlAttribute from "./GomlAttribute";
import GomlNode from "./GomlNode";

/**
 * Parser of Goml to Node utilities.
 * This class do not store any nodes and goml properties.
 */
class GomlParser {
  /**
   * Parse Goml to Node
   * @param {HTMLElement} soruce [description]
   */
  public static parse(source: HTMLElement, configurator: GomlConfigurator): GomlNode {
    const newNode = GomlParser._createNode(source, configurator);
    // タグ名が無効、又はattibuteが無効だった場合にはパースはキャンセルされる。HTMLElement側のattrにparseされていないことを記述
    if (newNode) {
      const children = source.childNodes;
      if (children && children.length !== 0) {
        for (let i = 0; i < children.length; i++) {
          if (children[i].nodeType !== 1) {
            continue;
          }
          // generate instances for every children nodes
          const e = <HTMLElement>children[i];
          // TODO: childrenの中からcomponentsを探してコンポーネントとしてパース。
          if (e.tagName === newNode.nodeName + ".components") { // TODO: 判定条件あってる？
            GomlParser._parseComponents(newNode, e);
            continue;
          }
          const newChildNode = GomlParser.parse(e, configurator);
          if (newChildNode) {
            newNode.addChild(newChildNode);
          }
        }
      }
      // console.log("parseChild finish:", newNode);
      return newNode;
    } else {
      // when specified node could not be found
      console.warn(`"${source.tagName}" was not parsed.`);
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
  private static _createNode(elem: HTMLElement, configurator: GomlConfigurator): GomlNode {
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
    const newNode = nodeType.createNode(configurator);
    /**
     * HTMLElementのattributeとのバインディング
     *
     * Nodeの必須Attributes一覧を取得し、HTMLElementに存在しなければ追加。
     * HTMLElementのすべてのattributesを取得し、NodeのAttributesに反映。なかった場合にはreserveする。
     */
    // console.log(elem.outerHTML);
    newNode.forEachAttr((attr, key) => {
      if (!this._parseGomlAttribute(attr, elem)) {
        throw new Error("'${attrName}' is RequiredAttribute. but value is not assigned.");
      }
    });
    // newNode.props.setProp<HTMLElement>("elem", elem);
    elem.setAttribute("x-j3-id", newNode.id); // TODO:rename!!
    // console.log("END");
    return newNode;
  }
  private static _parseComponents(node: GomlNode, componentsTag: HTMLElement): void {
    let components = componentsTag.childNodes;
    if (!components) {
      return;
    }
    for (let i = 0; i < components.length; i++) {
      if (components[i].nodeType !== 1) {
        continue;
      }
      const tag = <HTMLElement>components[i];
      const tagName = tag.tagName;
      const component = GomlConfigurator.Instance.getComponent(tagName);
      if (!component) {
        throw new Error(`Component ${tagName} is not found.`);
      }

      // コンポーネントの属性がタグの属性としてあればそれを、なければデフォルトを、それもなければ必須属性はエラー
      component.RequiredAttributes.forEach((attr) => {
        if (!this._parseGomlAttribute(attr, tag)) {
          throw new Error("'${attrName}' is RequiredAttribute. but value is not assigned.");
        }
      });
      component.OptionalAttributes.forEach((attr) => {
        this._parseGomlAttribute(attr, tag);
      });

      node.components.push(component);
    }
  }

  /**
   *
   * return : 値の設定に成功したか
   */
  private static _parseGomlAttribute(attr: GomlAttribute, tag: HTMLElement): boolean {
    let attrName = attr.Name;
    let tagAttrValue = tag.getAttribute(attrName);
    if (tagAttrValue) {
      attr.Value = tagAttrValue;
    } else {
      let attrDefaultValue = attr.DefaultValue;
      if (attrDefaultValue === undefined) {
        return false;
      }
      attr.Value = attrDefaultValue;
      tag.setAttribute(attrName, attr.ValueStr);
    }
    attr.on("changed", (ga: GomlAttribute) => {
      tag.setAttribute(attrName, ga.Value);
    });
    return true;
  }
}

export default GomlParser;
