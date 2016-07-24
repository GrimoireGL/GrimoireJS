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
    console.log("parse");
    const newNode = GomlParser._createNode(source, inheritedRequiredConponents);
    if (!newNode) {
      // when specified node could not be found
      console.warn(`"${source.tagName}" was not parsed.`);
      return null;
    }

    console.log("node parsing success!");
    const children = source.childNodes;
    if (children && children.length !== 0) {
      for (let i = 0; i < children.length; i++) {
        if (children[i].nodeType !== 1) {
          continue;
        }
        console.log("children exist!!!");
        const e = <Element>children[i];

        // check <node.components>
        if (e.tagName === newNode.nodeName + ".components") {
          console.log("found .components tag.");
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
          newNode.addChild(newChildNode, null, false);
        }
      }
      console.log("children parse finish!");
    }
    return newNode;
  }

  /**
   * GomlNodeの生成、初期化を行います。
   * @param  {HTMLElement}      elem         [description]
   * @param  {GomlConfigurator} configurator [description]
   * @return {GomlTreeNodeBase}              [description]
   */
  private static _createNode(elem: Element, inheritedRequiredConponents?: NamespacedIdentity[]): GomlNode {
    // console.log("createNode"+elem);
    const tagName = elem.tagName;
    console.log("tagName:" + tagName);
    const recipe = GrimoireInterface.nodeDeclarations.get(tagName);
    if (!recipe) {
      throw new Error(`Tag "${tagName}" is not found.`);
    }
    const defaultValues = recipe.defaultAttributes;
    const newNode = recipe.createNode(elem, inheritedRequiredConponents);


    console.log(`"atribute binding. neNode::" ${JSON.stringify(newNode.attributes.toArray()) }`);

    // AtributeをDOMから設定、できなければノードのデフォルト値で設定、それもできなければATTRのデフォルト値
    newNode.forEachAttr((attr, key) => {
      this._parseAttribute(attr, elem, defaultValues.get(attr.name));
    });

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
      const component = GrimoireInterface.componentDeclarations.get(tagName);
      if (!component) {
        throw new Error(`Component ${tagName} is not found.`);
      }

      // コンポーネントの属性がタグの属性としてあればそれを、なければデフォルトを、それもなければ必須属性はエラー
      component.attributeDeclarations.forEach((attr) => {
        this._parseAttribute(attr.generateAttributeInstance(), tag);
      });

      node.components.set(component.name, component.generateInstance());
    }
  }

  private static _parseAttribute(attr: Attribute, tag: Element, defaultValue?: any): void {
    let attrName = attr.name;
    let tagAttrValue = tag.getAttribute(attrName.name);
    if (!!tagAttrValue) {
      console.log("DOMElement value is : " + tagAttrValue);
      attr.Value = tagAttrValue;
    } else if (defaultValue !== undefined) {
      console.log("use default value: " + `${defaultValue}`);
      attr.Value = defaultValue;
    }
  }
}

export default GomlParser;
