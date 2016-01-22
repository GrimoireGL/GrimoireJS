import GomlNodeMethods = require("./Miscellaneous/GomlNodeMethods");
import GomlTreeNodeBase = require("../Goml/GomlTreeNodeBase");
import J3ObjectBase = require("./J3ObjectBase");

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
    // check arguments and initialize valuables.
    let nodes, query;
    if (this instanceof J3Object) {
      // call with new operator
      if (nodes_query instanceof GomlTreeNodeBase) {
        nodes = [nodes_query];
      } else if (nodes_query instanceof Array && nodes_query[0] instanceof GomlTreeNodeBase) {
        nodes = nodes_query;
      } else {
        if (typeof nodes_query === "string") {
          throw new Error("You should use constructor with no new expression.");
        }
      }

    } else {
      // call with no new, this keyword will be window
      if (nodes_query instanceof Array && nodes_query[0] instanceof GomlTreeNodeBase) {
        nodes = nodes_query;
        console.warn("you should use constructor with new expression when you call with Node argument");
      } else {
        query = nodes_query;
      }
    }
    if (nodes) {
      this.nodes = nodes;
    } else if (query) {

    } else {
      throw new Error("something fatal ocuuered");
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
