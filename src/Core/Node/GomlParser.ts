import NamespacedDictionary from "../Base/NamespacedDictionary";
import Attribute from "./Attribute";
import GomlNode from "./GomlNode";
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
  public static parse(source: Element, isRoot: boolean): GomlNode {
    const newNode = GomlParser._createNode(source);
    if (!newNode) {
      // when specified node could not be found
      console.warn(`"${source.tagName}" was not parsed.`);
      return null;
    }
    if (isRoot) {
     // generate first shared object for root node.
     // Root node must be bounded with script tag
     newNode.sharedObject = new NamespacedDictionary<any>();
    }
    // Parse children recursively
    const children = source.childNodes;
    if (children && children.length !== 0) { // When there is children
      const regexToFindComponent = /\.COMPONENTS$/mi; // TODO might needs to fix
      for (let i = 0; i < children.length; i++) {
        const child = children.item(i);
        if (GomlParser._isElement(child)) {
          // parse as components
          if (regexToFindComponent.test(child.nodeName)) {
            GomlParser._parseComponents(newNode, child);
            source.removeChild(child);
            continue;
          }
          // parse as child node.
          const newChildNode = GomlParser.parse(child, false);
          if (newChildNode) {
            newNode.addChild(newChildNode, null, false);
          }
        }
      }
    }
    return newNode;
  }

  /**
   * GomlNodeの生成、初期化を行います。
   * @param  {HTMLElement}      elem         [description]
   * @param  {GomlConfigurator} configurator [description]
   * @return {GomlTreeNodeBase}              [description]
   */
  private static _createNode(elem: Element): GomlNode {
    // console.log("createNode" + elem);
    const tagName = elem.localName;
    const recipe = GrimoireInterface.nodeDeclarations.get(elem);
    if (!recipe) {
      throw new Error(`Tag "${tagName}" is not found.`);
    }
    const defaultValues = recipe.defaultAttributes;
    const newNode = recipe.createNode(elem);

    // AtributeをDOMから設定、できなければノードのデフォルト値で設定、それもできなければATTRのデフォルト値
    newNode.forEachAttr((attr, key) => {
      this._parseAttribute(attr, elem, defaultValues.get(attr.name));
    });
    elem.setAttribute("x-gr-id", newNode.id);
    GrimoireInterface.nodeDictionary[newNode.id] = newNode;
    return newNode;
  }



  private static _parseComponents(node: GomlNode, componentsTag: Element): void {
    let componentNodes = componentsTag.childNodes;
    if (!componentNodes) {
      return;
    }
    for (let i = 0; i < componentNodes.length; i++) {
      const componentNode = componentNodes.item(i) as Element;
      if (componentNode.nodeType !== Node.ELEMENT_NODE) {
        continue; // Skip if the node was not element
      }
      const component = GrimoireInterface.componentDeclarations.get(componentNode);
      if (!component) { // Verify specified component is actual existing.
        throw new Error(`Component ${componentNode.tagName} is not found.`);
      }

      // コンポーネントの属性がタグの属性としてあればそれを、なければデフォルトを、それもなければ必須属性はエラー
      component.attributeDeclarations.forEach((attr) => {
        this._parseAttribute(attr.generateAttributeInstance(), componentNode);
      });
      node.addComponent(component.generateInstance(node));
    }
  }

  private static _isElement(node: Node): node is Element {
    return node.nodeType === Node.ELEMENT_NODE;
  }

  private static _parseAttribute(attr: Attribute, tag: Element, defaultValue?: any): void {
    let attrName = attr.name;
    const attrDictionary: { [key: string]: string } = {};
    const domAttr = tag.attributes;
    for (let i = 0; i < domAttr.length; i++) {
      const attrNode = domAttr.item(i);
      const name = attrNode.name.toUpperCase();
      attrDictionary[name] = attrNode.value;
    }

    let tagAttrValue = attrDictionary[attrName.name];
    if (!!tagAttrValue) {
      attr.Value = tagAttrValue;
    } else if (defaultValue !== void 0) {
      attr.Value = defaultValue;
    }
  }
}

export default GomlParser;
