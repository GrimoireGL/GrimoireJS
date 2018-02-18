import GrimoireInterface from "../Core/GrimoireInterface";
import IGrimoireComponentModel from "../Interface/IGrimoireComponentModel";
import IGrimoireNodeModel from "../Interface/IGrimoireNodeModel";
import * as Utility from "../Tool/Utility";
import XMLReader from "../Tool/XMLReader";
import Component from "./Component";
import GomlNode from "./GomlNode";

/**
 * Parser of Goml to Node utilities.
 * This class do not store any nodes and goml properties.
 */
export default class GomlParser {

  /**
   * parsing XML-DOM to Grimoire object model.
   * @param source XML-DOM
   */
  public static parseToGOM(source: Element): IGrimoireNodeModel {
    Utility.assert(!!source, "source cannot be null");
    return parseNode(source);

    function parseNode(elem: Element): IGrimoireNodeModel {
      const name = elem.namespaceURI ? `${elem.namespaceURI}.${elem.localName!}` : elem.localName!;
      const attributes = Utility.getAttributes(elem);
      const childrenElement = Array.from(elem.childNodes);
      const optionalComponents: IGrimoireComponentModel[] = [];
      const childNodeElements: Element[] = [];
      childrenElement.forEach(child => {
        if (!Utility.isElement(child)) {
          return;
        }
        if (GomlParser._isComponentsTag(child)) {
          const parsed = parseComponents(child);
          optionalComponents.push(...parsed);
        } else {
          childNodeElements.push(child);
        }
      });
      const children = childNodeElements.map(parseNode);
      const ret = { name } as IGrimoireNodeModel;
      if (Object.keys(attributes).length !== 0) {
        ret.attributes = attributes;
      }
      if (optionalComponents.length !== 0) {
        ret.optionalComponents = optionalComponents;
      }
      if (children.length !== 0) {
        ret.children = children;
      }
      return ret;
    }
    function parseComponents(elem: Element): IGrimoireComponentModel[] {
      const componentNodes = Array.from(elem.childNodes);
      return componentNodes.filter(Utility.isElement).map(it => {
        const name = it.namespaceURI ? `${it.namespaceURI}.${it.localName!}` : it.localName!;
        const attributes = Utility.getAttributes(it);
        const ret = {
          name,
        } as IGrimoireComponentModel;
        if (Object.keys(attributes).length !== 0) {
          ret.attributes = attributes;
        }
        return ret;
      });
    }
  }

  /**
   * parsing GOM to GomlNode tree strucure.
   * @param gom
   */
  public static parseGOMToGomlNode(gom: IGrimoireNodeModel): GomlNode {
    const namespace = gom.name.substr(0, gom.name.lastIndexOf("."));
    const name = gom.name.substr(gom.name.lastIndexOf(".") + 1);
    const rootElement = XMLReader.parseXML(namespace === "" ? `<${name}/>` : `<ns:${name} xmlns:ns="${namespace}"/>`);
    return createNode(gom, undefined, rootElement);

    function createNode(source: IGrimoireNodeModel, parent?: GomlNode, element?: Element): GomlNode {
      const declaration = GrimoireInterface.nodeDeclarations.get(source.name);
      if (!declaration) {
        throw new Error(`Tag "${source.name}" is not found.`);
      }
      const node = new GomlNode(declaration, element);
      if (parent) {
        parent.addChild(node); // 先に親を設定するのはパフォーマンス上の理由
      }

      const components = source.optionalComponents ? createComponents(source.optionalComponents) : [];
      components.forEach(c => {
        node._addComponentDirectly(c, false);
      });
      node.gomAttribute = source.attributes || {};
      (source.children || []).forEach(it => createNode(it, node));
      return node;
    }
    function createComponents(components: IGrimoireComponentModel[]): Component[] {
      return components.map(it => {
        const componentDecl = GrimoireInterface.componentDeclarations.get(it.name);
        if (!componentDecl) {
          throw new Error(`Component ${it.name} is not found.`);
        }
        const instance = componentDecl.generateInstance();
        instance.gomAttribute = it.attributes || {};
        return instance;
      });
    }
  }

  /**
   * Domをパースする
   * @param  {Element}           source    [description]
   * @param  {GomlNode}          parent    あればこのノードにaddChildされる
   * @return {GomlNode}                    ルートノード
   */
  public static parse(source: Element): GomlNode {
    const gom = GomlParser.parseToGOM(source);
    return GomlParser.parseGOMToGomlNode(gom);
  }

  private static _isComponentsTag(element: Element): boolean {
    const regexToFindComponent = /\.COMPONENTS$/mi;
    return regexToFindComponent.test(element.nodeName);
  }

}
