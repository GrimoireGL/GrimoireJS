import GomlNode from "./GomlNode";
import GrimoireInterface from "../GrimoireInterface";

/**
 * Parser of Goml to Node utilities.
 * This class do not store any nodes and goml properties.
 */
class GomlParser {
  /**
   * Domをパースする
   * @param  {Element}           source    [description]
   * @param  {GomlNode}          parent    あればこのノードにaddChildされる
   * @return {GomlNode}                    ルートノード
   */
  public static parse(source: Element, parent?: GomlNode |null): GomlNode {
    const newNode = GomlParser._createNode(source);

    // Parse children recursively
    const children = source.childNodes;
    const childNodeElements: Element[] = []; // for parse after .Components has resolved.
    if (children && children.length !== 0) { // When there is children
      const removeTarget: Node[] = [];
      for (let i = 0; i < children.length; i++) {
        const child = children.item(i);
        if (!GomlParser._isElement(child)) {
          removeTarget.push(child);
          continue;
        }
        if (this._isComponentsTag(child)) {
          // parse as components
          GomlParser._parseComponents(newNode, child);
          removeTarget.push(child);
        } else {
          // parse as child node.
          childNodeElements.push(child);
        }
      }
      // remove unused elements
      for (let i = 0; i < removeTarget.length; i++) {
        source.removeChild(removeTarget[i]);
      }
    }

    // generate tree
    if (parent) {
      parent.addChild(newNode, null, false);
    }

    childNodeElements.forEach((child) => {
      GomlParser.parse(child, newNode);
    });
    return newNode;
  }

  /**
   * GomlNodeのインスタンス化。GrimoireInterfaceへの登録
   * @param  {HTMLElement}      elem         [description]
   * @param  {GomlConfigurator} configurator [description]
   * @return {GomlTreeNodeBase}              [description]
   */
  private static _createNode(elem: Element): GomlNode {
    const tagName = elem.localName;
    const recipe = GrimoireInterface.nodeDeclarations.get(elem);
    if (!recipe) {
      throw new Error(`Tag "${tagName}" is not found.`);
    }
    return new GomlNode(recipe, elem);
  }

  /**
   * .COMPONENTSのパース。
   * @param {GomlNode} node          アタッチされるコンポーネント
   * @param {Element}  componentsTag .COMPONENTSタグ
   */
  private static _parseComponents(node: GomlNode, componentsTag: Element): void {
    let componentNodes = componentsTag.childNodes;
    if (!componentNodes) {
      return;
    }
    for (let i = 0; i < componentNodes.length; i++) {
      const componentNode = componentNodes.item(i) as Element;
      if (!GomlParser._isElement(componentNode)) {
        continue; // Skip if the node was not element
      }
      const componentDecl = GrimoireInterface.componentDeclarations.get(componentNode);
      if (!componentDecl) { // Verify specified component is actual existing.
        throw new Error(`Component ${componentNode.tagName} is not found.`);
      }

      const component = componentDecl.generateInstance(componentNode);
      node._addComponentDirectly(component, false);
    }
  }

  private static _isElement(node: Node): node is Element {
    return node.nodeType === Node.ELEMENT_NODE;
  }

  private static _isComponentsTag(element: Element): boolean {
    const regexToFindComponent = /\.COMPONENTS$/mi; // TODO might needs to fix
    return regexToFindComponent.test(element.nodeName);
  }

}

export default GomlParser;
