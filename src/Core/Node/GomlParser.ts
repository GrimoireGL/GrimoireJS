import Attribute from "./Attribute";
import GomlNode from "./GomlNode";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import GrimoireInterface from "../GrimoireInterface";

/**
 * Parser of Goml to Node utilities.
 * This class do not store any nodes and goml properties.
 */
class GomlParser {
  /**
   * Parse Goml to Node
   * @param {HTMLElement} soruce [description]
   */
  public static parse(source: Element, inheritedRequiredConponents?: NamespacedIdentity[]): GomlNode {
    const newNode = GomlParser._createNode(source, inheritedRequiredConponents);
    // タグ名が無効、又はattibuteが無効だった場合にはパースはキャンセルされる。HTMLElement側のattrにparseされていないことを記述
    if (newNode) {
      const children = source.childNodes;
      if (children && children.length !== 0) {
        for (let i = 0; i < children.length; i++) {
          if (children[i].nodeType !== 1) {
            continue;
          }
          const e = <Element>children[i];

          // check <node.components>
          if (e.tagName === newNode.nodeName + ".components") {
            GomlParser._parseComponents(newNode, e);
            continue;
          }

          // parse child node.
          // let rcForChild = newNode.Recipe.RequiredComponentsForChildren;
          let rcForChild = null;
          if (!!inheritedRequiredConponents && inheritedRequiredConponents !== null) {
            rcForChild = rcForChild.concat(inheritedRequiredConponents);

            // remove　overLap
            rcForChild = rcForChild.filter((x, i, self) => self.indexOf(x) === i);
          }
          const newChildNode = GomlParser.parse(e, rcForChild);
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
   * @param  {HTMLElement}      elem         [description]
   * @param  {GomlConfigurator} configurator [description]
   * @return {GomlTreeNodeBase}              [description]
   */
  private static _createNode(elem: Element, inheritedRequiredConponents?: NamespacedIdentity[]): GomlNode {
    const tagName = elem.tagName;
    const recipe = GrimoireInterface.objectNodeDeclaration.get(tagName);
    if (recipe === undefined) {
      throw new Error(`Tag ${tagName} is not found.`);
    }
    const defaultValues = recipe.defaultAttributes;
    const newNode = recipe.createNode(elem, inheritedRequiredConponents);

    /**
     * HTMLElementのattributeとのバインディング
     *
     * Nodeの必須Attributes一覧を取得し、HTMLElementに存在しなければ追加。
     * HTMLElementのすべてのattributesを取得し、NodeのAttributesに反映。
     */
    newNode.forEachAttr((attr, key) => {
      if (!this._parseAttribute(attr, elem, defaultValues.get(attr.name))) {
        throw new Error("'${attrName}' is RequiredAttribute. but value is not assigned.");
      }
    });
    // newNode.props.setProp<HTMLElement>("elem", elem);
    elem.setAttribute("x-j3-id", newNode.id); // TODO:rename!!
    return newNode;
  }


  private static _parseComponents(node: GomlNode, componentsTag: Element): void {
    let components = componentsTag.childNodes;
    if (!components) {
      return;
    }
    for (let i = 0; i < components.length; i++) {
      if (components[i].nodeType !== 1) {
        continue;
      }
      const tag = <Element>components[i];
      const tagName = tag.tagName;
      const component = GrimoireInterface.components.get(tagName);
      if (!component) {
        throw new Error(`Component ${tagName} is not found.`);
      }

      // コンポーネントの属性がタグの属性としてあればそれを、なければデフォルトを、それもなければ必須属性はエラー
      component.requiredAttributes.forEach((attr) => {
        this._parseAttribute(attr.generateAttributeInstance(), tag);
      });
      component.optionalAttributes.forEach((attr) => {
        this._parseAttribute(attr.generateAttributeInstance(), tag);
      });

      node.components.set(component.name, component.generateInstance());
    }
  }

  /**
   * attempt get attribute value from goml.
   * if fail,try use attr defaultValue,and defaultValue arguments.
   * return : 値の設定に成功したか(デフォルト値での設定も含む)
   */
  private static _parseAttribute(attr: Attribute, tag: Element, defaultValue?: any): boolean {
    let attrName = attr.name;
    let tagAttrValue = tag.getAttribute(attrName.name);
    if (tagAttrValue) {
      attr.Value = tagAttrValue;
    } else {
      if (defaultValue !== undefined) {
        attr.Value = defaultValue;
      }else {
        return false;
      }
      tag.setAttribute(attrName.name, attr.ValueStr);
    }
    attr.on("changed", (ga: Attribute) => {
      tag.setAttribute(attrName.name, ga.Value);
    });
    return true;
  }
}

export default GomlParser;
