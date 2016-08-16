import GomlNode from "./GomlNode";
import GrimoireInterface from "../GrimoireInterface";

/**
 * Parser of Goml to Node utilities.
 * This class do not store any nodes and goml properties.
 */
class GomlParser {
  /**
   * Parse Goml to Node
   * @param  {Element}           source    [description]
   * @param  {GomlNode}          parent    あればこのノードにaddChildされる
   * @return {GomlNode}                    [description]
   */
  public static parse(source: Element, parent: GomlNode): GomlNode {
    const newNode = GomlParser._createNode(source);
    if (!newNode) {
      // when specified node could not be found
      console.warn(`"${source.tagName}" was not parsed.`);
      return null;
    }

    // Parse children recursively
    const children = source.childNodes;
    if (children && children.length !== 0) { // When there is children
      const regexToFindComponent = /\.COMPONENTS$/mi; // TODO might needs to fix
      const childNodeElements: Element[] = []; // for parse after .Components has resolved.
      for (let i = 0; i < children.length; i++) {
        const child = children.item(i);
        if (!GomlParser._isElement(child)) {
          continue;
        }
        if (regexToFindComponent.test(child.nodeName)) {
          // parse as components
          GomlParser._parseComponents(newNode, child);
          source.removeChild(child);
        } else {
          // parse as child node.
          childNodeElements.push(child);
        }
      }

      // resoleve attribute default value.
      newNode.resolveAttributesValue();

      // mounting.
      if (parent) {
        parent.addChild(newNode, null, false);
      } else {
        newNode.setMounted(true); // root node mounting.
      }

      childNodeElements.forEach((child) => {
        GomlParser.parse(child, newNode);
      });
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
    const tagName = elem.localName;
    const recipe = GrimoireInterface.nodeDeclarations.get(elem);
    if (!recipe) {
      throw new Error(`Tag "${tagName}" is not found.`);
    }
    const newNode = new GomlNode(recipe, elem);

    GrimoireInterface.nodeDictionary[newNode.id] = newNode;
    return newNode;
  }

  /**
   * .COMPONENTSのパース。
   * @param {GomlNode} node          アタッチされるコンポーネント
   * @param {Element}  componentsTag .COMPONENTSタグ
   */
  private static _parseComponents(node: GomlNode, componentsTag: Element): void {
    node.componentsElement = componentsTag;
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
      node.addComponent(component);
    }
  }

  private static _isElement(node: Node): node is Element {
    return node.nodeType === Node.ELEMENT_NODE;
  }

}

export default GomlParser;
