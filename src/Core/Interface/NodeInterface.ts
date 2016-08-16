import GrimoireInterface from "../GrimoireInterface";
import XMLReader from "../Base/XMLReader";
import GomlParser from "../Node/GomlParser";
import Attribute from "../Node/Attribute";
import NamespacedIdentity from "../Base/NamespacedIdentity";
import Component from "../Node/Component";
import INodeInterfaceBase from "./INodeInterfaceBase";
import ComponentInterface from "./ComponentInterface";
import IComponentInterface from "./IComponentInterface";
import GomlNode from "../Node/GomlNode";


/**
 * 複数のノードを対象とした操作を提供するインタフェース
 */
class NodeInterface implements INodeInterfaceBase {
  constructor(public nodes: GomlNode[][]) {

  }
  public queryFunc(query: string): IComponentInterface {
    return new ComponentInterface(this.queryComponents(query));
  }

  public queryComponents(query: string): Component[][][] {
    return this.nodes.map((nodes) => {
      return nodes.map((node) => {
        const componentElements = node.componentsElement.querySelectorAll(query);
        const components: Component[] = [];
        for (let i = 0; i < componentElements.length; i++) {
          const elem = componentElements[i];
          const component = GrimoireInterface.componentDictionary[elem.getAttribute("x-gr-id")];
          if (component) {
            components.push(component);
          }
        }
        return components;
      });
    });
  }

  public attr(attrName: string | NamespacedIdentity): Attribute;
  public attr(attrName: string | NamespacedIdentity, value: any): void;
  public attr(attrName: string | NamespacedIdentity, value?: any): Attribute | void {
    if (value === void 0) {
      // return Attribute.
      this.forEach((node) => {
        const attr = node.attributes.get(attrName as string);
        if (!attr) {
          return attr;
        }
      });
    } else {
      // set value.
      this.forEach((node) => {
        const attr = node.attributes.get(attrName as string);
        if (attr.declaration.readonly) {
          throw new Error(`The attribute ${attr.name.fqn} is readonly`);
        }
        if (attr) {
          attr.Value = value;
        }
      });
    }
  }

  /**
   * 対象ノードにイベントリスナを追加します。
   * @param {string}   eventName [description]
   * @param {Function} listener  [description]
   */
  public on(eventName: string, listener: Function): NodeInterface {
    this.forEach((node) => {
      node.on(eventName, listener);
    });
    return this;
  }

  /**
   * 対象ノードに指定したイベントリスナが登録されていれば削除します
   * @param {string}   eventName [description]
   * @param {Function} listener  [description]
   */
  public off(eventName: string, listener: Function): NodeInterface {
    this.forEach((node) => {
      node.removeListener(eventName, listener);
    });
    return this;
  }

  /**
   * このノードインタフェースが対象とするノードそれぞれに、
   * タグで指定したノードを子要素として追加します。
   * @param {string} tag [description]
   */
  public append(tag: string): NodeInterface {
    this.forEach((node) => {
      const elems = XMLReader.parseXML(tag);
      elems.forEach((elem) => GomlParser.parse(elem, node));
    });
    return this;
  }

  /**
   * このノードインタフェースが対象とするノードの子に、
   * 指定されたノードが存在すれば削除します。
   * @param {GomlNode} child [description]
   */
  public remove(child: GomlNode): NodeInterface {
    this.forEach((node) => {
      node.removeChild(child);
    });
    return this;
  }

  /**
   * このノードインタフェースが対象とするノードに対して反復処理を行います
   * @param  {GomlNode} callback [description]
   * @return {[type]}            [description]
   */
  public forEach(callback: ((node: GomlNode) => void)): NodeInterface {
    this.nodes.forEach((array) => {
      array.forEach((node) => {
        callback(node);
      });
    });
    return this;
  }

  /**
   * このノードインタフェースが対象とするノードを有効、または無効にします。
   * @param {boolean} enable [description]
   */
  public setEnable(enable: boolean): NodeInterface {
    this.forEach((node) => {
      node.enable = !!enable;
    });
    return this;
  }

  /**
   * このノードインタフェースにアタッチされたコンポーネントをセレクタで検索します。
   * @pram  {string}      query [description]
   * @return {Component[]}       [description]
   */
  public find(query: string): Component[] {
    const allComponents: Component[] = [];
    this.queryComponents(query).forEach((gomlComps) => {
      gomlComps.forEach((nodeComps) => {
        nodeComps.forEach((comp) => {
          allComponents.push(comp);
        });
      });
    });
    return allComponents;
  }

  /**
   * このノードインタフェースが対象とするノードのそれぞれの子ノードを対象とする、
   * 新しいノードインタフェースを取得します。
   * @return {NodeInterface} [description]
   */
  public children(): NodeInterface {
    const children = this.nodes.map((nodes) => {
      return nodes.map((node) => {
        return node.children;
      }).reduce((pre, cur) => {
        return pre.concat(cur);
      });
    });
    return new NodeInterface(children);
  }

  /**
   * 対象ノードにコンポーネントをアタッチします。
   * @param {Component} component [description]
   */
  public addCompnent(componentId: NamespacedIdentity): NodeInterface {
    this.forEach((node) => {
      const componentDec = GrimoireInterface.componentDeclarations.get(componentId);
      const comp = componentDec.generateInstance();
      node.addComponent(comp);
    });
    return this;
  }
}


export default NodeInterface;
