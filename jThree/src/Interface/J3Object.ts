import GomlTreeNodeBase = require("../Goml/GomlTreeNodeBase");
import J3ObjectBase = require("./J3ObjectBase");
import InterfaceSelector = require("./Static/InterfaceSelector");
import isArray = require("lodash.isarray");
import isString = require("lodash.isstring");
// for Implements
import GomlNodeMethods = require("./Miscellaneous/GomlNodeMethods");
import TreeTraversal = require("./Traversing/TreeTraversal");
import GeneralAttributes = require("./Manipulation/GeneralAttributes");
import CollectionManipulation = require("./Manipulation/CollectionManipulation");

/**
 * Provides jQuery like API for jThree.
 */
class J3Object extends J3ObjectBase implements GomlNodeMethods, TreeTraversal, GeneralAttributes, CollectionManipulation {
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
  constructor(argu: any) {
    super();
    let nodes: GomlTreeNodeBase[];
    let query: string;
    switch (true) {
      case (isString(argu)):
        query = argu;
        break;
      case (argu instanceof GomlTreeNodeBase):
        nodes = [argu];
        break;
      case (isArray(argu) && (<GomlTreeNodeBase[]>argu).every((v) => v instanceof GomlTreeNodeBase)):
        nodes = argu;
        break;
      default:
        throw new Error("Argument type is not correct");
    }
    if (nodes) {
      this.setArray(nodes);
    } else if (query) {
      this.setArray(InterfaceSelector.find(query));
    }
  }

  /**
   * Utilities/Utilities
   */

  public static each: {
    (argu0: any, callback: (argu1: any, argu2: any) => any): any;
  };

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

  /**
   * Traversing/TreeTraversal
   */

  public find: {
    (selector: string): J3Object;
    (node: GomlTreeNodeBase): J3Object;
    (j3obj: J3Object): J3Object;
    (argu: any): J3Object;
  };

  /**
   * Manipulation/GeneralAttributes
   */

  public attr: {
    (attributeName: string): string;
    (attributeName: string, value: any): J3Object;
    (attributes: Object): J3Object;
    (attributeName: string, func: (number, string) => string): J3Object;
    (attributeName: string, func: (number, string) => number): J3Object;
    (argu0: any, argu1?: any): any;
  };

  public attrObj: {
    (attributeName: string): any;
    (attributeName: string, value: any): J3Object;
    (attributes: Object): J3Object;
    (argu0: any, argu1?: any): any;
  };

  /**
   * Manipulation/CollectionManipulation
   */

  public each: {
    (func: (index: number, node: GomlTreeNodeBase) => boolean): J3Object;
  };
}

export = J3Object;
