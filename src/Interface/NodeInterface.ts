import Utility from "../Base/Utility";
import XMLReader from "../Base/XMLReader";
import GomlParser from "../Node/GomlParser";
import Attribute from "../Node/Attribute";
import NSIdentity from "../Base/NSIdentity";
import GomlNode from "../Node/GomlNode";


/**
 * 複数のノードを対象とした操作を提供するインタフェース
 */
class NodeInterface {
  constructor(public nodes: GomlNode[][]) {
    if (!nodes) {
      throw new Error("nodes is null");
    }
  }

  /**
   * 対象となるノードの個数を取得する
   * @return {number} [description]
   */
  public get count(): number {
    if (this.nodes.length === 0) {
      return 0;
    }
    const counts = this.nodes.map(nodes => nodes.length);
    return Utility.sum(counts);
  }

  public get isEmpty(): boolean {
    return this.count === 0;
  }

  public get<T extends GomlNode>(): T;
  public get<T extends GomlNode>(nodeIndex: number): T;
  public get<T extends GomlNode>(treeIndex: number, nodeIndex: number): T;
  public get<T extends GomlNode>(i1?: number, i2?: number): T {
    if (i1 === void 0) {
      const first = this.first();
      if (!first) {
        throw new Error("this NodeInterface is empty.");
      } else {
        return first as T;
      }
    } else if (i2 === void 0) {
      if (this.count <= i1) {
        throw new Error("index out of range.");
      } else {
        let c = i1;
        let returnNode: GomlNode = null;
        this.forEach(node => {
          if (c === 0) {
            returnNode = node;
          }
          c--;
        });
        return returnNode as T;
      }
    } else {
      if (this.nodes.length <= i1 || this.nodes[i1].length <= i2) {
        throw new Error("index out of range.");
      } else {
        return this.nodes[i1][i2] as T;
      }
    }
  }
  public getAttribute(attrName: string | NSIdentity): any {
    const first = this.first();
    if (!first) {
      throw new Error("this NodeInterface is empty.");
    }
    return first.getAttribute(attrName);
  }
  public setAttribute(attrName: string | NSIdentity, value: any): void {
    this.forEach((node) => {
      node.setAttribute(attrName, value, false);
    });
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
      elems.forEach((elem) => {
        let child = GomlParser.parse(elem, null, null);
        node.addChild(child);
      });
    });
    return this;
  }

  /**
   * このノードインタフェースが対象とするノードをツリーから削除します。s
   * @param {GomlNode} child [description]
   */
  public remove(): NodeInterface {
    this.forEach((node) => {
      node.remove();
    });
    return this;
  }

  /**
   * このノードインタフェースが対象とするノードに対して反復処理を行います
   * @param  {GomlNode} callback [description]
   * @return {[type]}            [description]
   */
  public forEach(callback: ((node: GomlNode, gomlIndex: number, nodeIndex: number) => void)): NodeInterface {
    this.nodes.forEach((array, gomlIndex) => {
      array.forEach((node, nodeIndex) => {
        callback(node, gomlIndex, nodeIndex);
      });
    });
    return this;
  }
  public find(predicate: (node: GomlNode, gomlIndex: number, nodeIndex: number) => boolean): GomlNode {
    const nodes = this.nodes;
    for (let i = 0; i < nodes.length; i++) {
      const array = nodes[i];
      for (let j = 0; j < array.length; j++) {
        const node = array[j];
        if (predicate(node, i, j)) {
          return node;
        }
      }
    }
    return null;
  }
  public watch(attrName: string | NSIdentity, watcher: ((newValue: any, oldValue: any, attr: Attribute) => void), immediate = false) {
    this.forEach(node => {
      node.watch(attrName, watcher, immediate);
    });
  }

  /**
   * このノードインタフェースが対象とするノードを有効、または無効にします。
   * @param {boolean} enable [description]
   */
  public setEnable(enable: boolean): NodeInterface {
    this.forEach((node) => {
      node.enabled = !!enable;
    });
    return this;
  }

  /**
   * このノードインタフェースが対象とするノードのそれぞれの子ノードを対象とする、
   * 新しいノードインタフェースを取得します。
   * @return {NodeInterface} [description]
   */
  public children(): NodeInterface {
    const children = this.nodes.map(nodes => {
      return Utility.flatMap(nodes, node => {
        return node.children;
      });
    });
    return new NodeInterface(children);
  }

  /**
   * 対象ノードにコンポーネントをアタッチします。
   * @param {Component} component [description]
   */
  public addComponent(componentId: string | NSIdentity, attributes: { [key: string]: any } = {}): NodeInterface {
    this.forEach((node) => {
      node.addComponent(componentId, attributes);
    });
    return this;
  }

  /**
   * 最初の対象ノードを取得する
   * @return {GomlNode} [description]
   */
  public first(): GomlNode {
    return this.find(() => true);
  }

  /**
   * 対象となる唯一のノードを取得する。
   * 対象が存在しない、あるいは複数存在するときは例外を投げる。
   * @return {GomlNode} [description]
   */
  public single(): GomlNode {
    if (this.count !== 1) {
      throw new Error("this nodeInterface is not single.");
    }
    const first = this.first();
    if (!first) {
      throw new Error("this nodeInterface is not single,but is empty.");
    }
    return first;
  }

  public filter(predicate: (node: GomlNode, gomlIndex: number, nodeIndex: number) => boolean): NodeInterface {
    const newNodes: GomlNode[][] = [];
    for (let i = 0; i < this.nodes.length; i++) {
      const goml = this.nodes[i];
      newNodes.push([]);
      for (let j = 0; j < goml.length; j++) {
        const node = goml[j];
        if (predicate(node, i, j)) {
          newNodes[i].push(node);
        }
      }
    }
    return new NodeInterface(newNodes);
  }
  public toArray(): GomlNode[] {
    return Utility.flat(this.nodes);
  }

  public addChildByName(nodeName: string | NSIdentity, attributes: { [attrName: string]: any }): void {
    this.forEach(node => {
      node.addChildByName(nodeName, attributes);
    });
  }
  public sendMessage(message: string, args?: any): void {
    this.forEach(node => {
      node.sendMessage(message, args);
    });
  }
  public broadcastMessage(range: number, name: string, args?: any): void;
  public broadcastMessage(name: string, args?: any): void;
  public broadcastMessage(arg1: number | string, arg2?: any, arg3?: any): void {
    if (typeof arg1 === "number") {
      this.forEach(node => {
        node.broadcastMessage(arg1, arg2, arg3);
      });
    } else {
      this.forEach(node => {
        node.broadcastMessage(arg2, arg3);
      });
    }
  }
}


export default NodeInterface;
