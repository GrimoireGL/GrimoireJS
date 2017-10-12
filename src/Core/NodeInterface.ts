import { ListenerFn } from "eventemitter3";
import Attribute from "../Core/Attribute";
import GomlNode from "../Core/GomlNode";
import GomlParser from "../Core/GomlParser";
import { Name, Nullable } from "../Tools/Types";
import Utility from "../Tools/Utility";
import XMLReader from "../Tools/XMLReader";

/**
 * interface for operate multicast nodes.
 */
export default class NodeInterface {
  /**
   * array of node targeted by this interface.
   * this property has two dimantion.
   * nodes[i] is node array in tree at i.
   * @param  {GomlNode[][]} nodes [description]
   * @return {[type]}             [description]
   */
  public nodes: GomlNode[][];

  constructor(nodes: GomlNode[][]) {
    this.nodes = nodes;
  }

  /**
   * get count of targeted nodes.
   * @return {number} [description]
   */
  public get count(): number {
    if (this.nodes.length === 0) {
      return 0;
    }
    const counts = this.nodes.map(nodes => nodes.length);
    return Utility.sum(counts);
  }

  /**
   * check count is 0.
   */
  public get isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Get node by index.
   * Calling with an argument omitted, the function returns first node.
   * and throw error if this interface is empty.
   *
   * Calling with one argument, it is treated as index of node.
   * this function returns the node at index across all tree.
   * throw error if index out of range.
   *
   * Calling with two arguments, they are treated as index of tree and node.
   * this function returns the node at node-index in a tree at tree-index.
   * throw error if index out of range.
   * @return {GomlNode} [description]
   */
  public get(): GomlNode;
  public get(nodeIndex: number): GomlNode;
  public get(treeIndex: number, nodeIndex: number): GomlNode;
  public get(i1?: number, i2?: number): GomlNode {
    if (i1 === undefined) {
      const first = this.first();
      if (!first) {
        throw new Error("this NodeInterface is empty.");
      } else {
        return first;
      }
    } else if (i2 === undefined) {
      if (this.count <= i1) {
        throw new Error("index out of range.");
      }
      let c = i1;
      return this.find(() => {
        if (c === 0) {
          return true;
        }
        c--;
        return false;
      })!;
    } else {
      if (this.nodes.length <= i1 || this.nodes[i1].length <= i2) {
        throw new Error("index out of range.");
      } else {
        return this.nodes[i1][i2];
      }
    }
  }

  /**
   * get attribute of first node.
   * throw error if this NodeInterface is empty.
   * @param attrName
   */
  public getAttribute(attrName: Name): any {
    const first = this.first();
    if (!first) {
      throw new Error("this NodeInterface is empty.");
    }
    return first.getAttribute(attrName);
  }

  /**
   * set attribute to all target node.
   * @param attrName
   * @param value
   */
  public setAttribute(attrName: Name, value: any): void {
    this.forEach(node => {
      node.setAttribute(attrName, value, false);
    });
  }

  /**
   * add event listener to all target node.
   * @param {string}   eventName [description]
   * @param {ListenerFn} listener  [description]
   */
  public on(eventName: string, listener: ListenerFn): NodeInterface {
    this.forEach(node => {
      node.on(eventName, listener);
    });
    return this;
  }

  /**
   * remove event listener from all node if exists.
   * @param {string}   eventName [description]
   * @param {ListenerFn} listener  [description]
   */
  public off(eventName: string, listener: ListenerFn): NodeInterface {
    this.forEach(node => {
      node.removeListener(eventName, listener);
    });
    return this;
  }

  /**
   * add node as child to all nodes.
   * @param {string} tag [description]
   */
  public append(tag: string): NodeInterface {
    this.forEach(node => {
      const elem = XMLReader.parseXML(tag);
      const child = GomlParser.parse(elem);
      node.addChild(child);
    });
    return this;
  }

  /**
   * remove all nodes from tree.
   * @param {GomlNode} child [description]
   */
  public remove(): NodeInterface {
    this.forEach(node => {
      node.remove();
    });
    return this;
  }

  /**
   * execute provided function once for each element targeted by this interface.
   * @param  {number} callback Function to execute for each element, taking three arguments:
   * abort the iteration if function returns True.
   * @return {[type]}          [description]
   */
  public forEach(callback: ((node: GomlNode, gomlIndex: number, nodeIndex: number, iterationHandler?: { abort: boolean }) => void)): NodeInterface {
    for (let i = 0; i < this.nodes.length; i++) {
      const array = this.nodes[i];
      const gomlIndex = i;
      for (let j = 0; j < array.length; j++) {
        const node = array[j];
        const nodeIndex = j;
        const ih = { abort: false };
        callback(node, gomlIndex, nodeIndex, ih);
        if (ih.abort) {
          return this;
        }
      }
    }
    return this;
  }

  /**
   * map all nodes to the results of provided function.
   * @param func
   */
  public map<T>(func: (node: GomlNode, gomlIndex: number, nodeIndex: number) => T): T[][] {
    return this.nodes.map((array, gomlIndex) => {
      return array.map((node, nodeIndex) => {
        return func(node, gomlIndex, nodeIndex);
      });
    });
  }

  /**
   * find first node that satisfies the provided testing function.
   * otherwise null is returned.
   * @param predicate
   */
  public find(predicate: (node: GomlNode, gomlIndex: number, nodeIndex: number) => boolean): Nullable<GomlNode> {
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

  /**
   * watch all nodes attribute.
   * @param attrName
   * @param watcher
   * @param immediate
   */
  public watch(attrName: Name, watcher: ((newValue: any, oldValue: any, attr: Attribute) => void), immediate = false) {
    this.forEach(node => {
      node.watch(attrName, watcher, immediate);
    });
  }

  /**
   * set enabled all nodes.
   * @param {boolean} enable [description]
   */
  public setEnable(enable: boolean): NodeInterface {
    this.forEach(node => {
      node.enabled = !!enable;
    });
    return this;
  }

  /**
   * create new NodeInterface with children of all nodes.
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
   * add component to all nodes.
   * @param {Component} component [description]
   */
  public addComponent(componentId: Name, attributes: { [key: string]: any } = {}): NodeInterface {
    this.forEach(node => {
      node.addComponent(componentId, attributes);
    });
    return this;
  }

  /**
   * return the first node.
   * return null if this NodeInterface is empty.
   * @return {GomlNode} [description]
   */
  public first(): Nullable<GomlNode> {
    return this.find(() => true);
  }

  /**
   * return the first node.
   * throw error if this NodeInterface count is not exactly 1.
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

  /**
   * create new NodeInterface with filterd nodes.
   * @param predicate
   */
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

  /**
   * convert to array.
   */
  public toArray(): GomlNode[] {
    return Utility.flat(this.nodes);
  }

  /**
   * add child node by name to all nodes.
   * @param nodeName
   * @param attributes
   */
  public addChildByName(nodeName: Name, attributes: { [attrName: string]: any }): NodeInterface {
    return new NodeInterface(this.map(node => {
      return node.addChildByName(nodeName, attributes);
    }));
  }

  /**
   * send message to all nodes.
   */
  public sendMessage(message: string, args?: any): void {
    this.forEach(node => {
      node.sendMessage(message, args);
    });
  }

  /**
   * broadcast message to all nodes.
   * @param range
   * @param name
   * @param args
   */
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
