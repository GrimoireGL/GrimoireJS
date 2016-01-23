import GomlNodeMethods = require("./Miscellaneous/GomlNodeMethods");
import GomlTreeNodeBase = require("../Goml/GomlTreeNodeBase");
import J3ObjectBase = require("./J3ObjectBase");
import InterfaceSelector = require("./InterfaceSelector");

/**
 * Provides jQuery like API for jThree.
 */
class J3Object extends J3ObjectBase implements GomlNodeMethods {
  /**
   * Construct J3Object from Nodes.
   * @param {GomlTreeNodeBase[]} nodes [description]
   */
  constructor(nodes: GomlTreeNodeBase[]);
  /**
   * Construct J3Object from selector query.
   * @param {string} query [description]
   */
  constructor(query: string);
  /**
   * Construct J3Object from Nodes or selector query.
   * @param {GomlTreeNodeBase[]} nodes [description]
   */
  constructor(nodes_query: GomlTreeNodeBase[] | string) {
    super();
    let nodes, query;
    if (nodes_query instanceof GomlTreeNodeBase) {
      nodes = [nodes_query];
    } else if (nodes_query instanceof Array && nodes_query[0] instanceof GomlTreeNodeBase) {
      nodes = nodes_query;
    } else if (typeof nodes_query === "string") {
      query = nodes_query;
    }
    if (nodes) {
      this.setArray(nodes);
    } else if (query) {
      this.setArray(InterfaceSelector.find(query));
    } else {
      throw new Error("Something fatal ocuuered.");
    }
  }

  /**
   * Miscellaneous/GomlNodeMethods
   */

  public get: {
    (): GomlTreeNodeBase[];
    (index: number): GomlTreeNodeBase;
    (index?: number): any;
  };

  public index: {
    (): number;
    (selector: string): number;
    (node: GomlTreeNodeBase): number;
    (j3obj: J3Object): number;
    (arg?: string | GomlTreeNodeBase | J3Object): number
  };
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

applyMixins(J3Object, [GomlNodeMethods]);

export = J3Object;
