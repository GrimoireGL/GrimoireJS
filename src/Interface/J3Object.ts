import GomlTreeNodeBase from "../Goml/GomlTreeNodeBase";
import J3ObjectBase from "./J3ObjectBase";
import isArray from "lodash.isarray";
import isString from "lodash.isstring";
// for Implements
import GomlNodeMethods from "./Miscellaneous/GomlNodeMethods";
import TreeTraversal from "./Traversing/TreeTraversal";
import Filtering from "./Traversing/Filtering";
import GeneralAttributes from "./Manipulation/GeneralAttributes";
import CollectionManipulation from "./Manipulation/CollectionManipulation";
import NodeInsertion from "./Manipulation/NodeInsertion";

/**
 * Provides jQuery like API for jThree.
 */
class J3Object extends J3ObjectBase implements GomlNodeMethods, TreeTraversal, Filtering, GeneralAttributes, CollectionManipulation, NodeInsertion {
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
      this.__setArray(nodes);
    } else if (query) {
      this.__setArray(J3Object.find(query));
    }
  }

  /**
   * Static/Utilities
   */

  /**
   * Iterate array or object.
   *
   * Array is given for first argument, callback function specified for second argument is evaluated for each item in array with index.
   * Object is given for first argument, callback function specified for second argument is evaluated for each value in object with property.
   * J3Object is given for first argument, callback function specified for second argument is evaluated for each targeted node with index.
   * Inside callback function, return true to continue to next iteration, return false to break the iteration loop.
   * If you does not return anything, it behaves same as you returns true.
   * This method is always returns first argument.
   */
  public static each: {
    <T>(array: T[], callback: (indexInArray: number, value: T) => boolean): T;
    <T>(array: T[], callback: (indexInArray: number, value: T) => void): T;
    (j3obj: J3ObjectBase, callback: (indexInArray: number, value: GomlTreeNodeBase) => void): J3ObjectBase;
    <T>(object: { [propertyName: string]: T }, callback: (propertyName: string, valueOfProperty: T) => boolean): { [propertyName: string]: T };
    <T>(object: { [propertyName: string]: T }, callback: (propertyName: string, valueOfProperty: T) => void): { [propertyName: string]: T };
    <T>(argu0: any, callback: (argu1: any, argu2: any) => any): any;
  }

  /**
   * Static/Find
   */

  /**
   * Find a Node from targeted context by query.
   *
   * Query string is same format as the argument of querySelectorAll.
   * If you omission the context specified for second argument, search from root of Node tree.
   */
  public static find: {
    (selector: string, context?: GomlTreeNodeBase): GomlTreeNodeBase[];
  };

  /**
   * Miscellaneous/GomlNodeMethods
   */

  /**
   * Get Nodes.
   *
   * It returns targeted Nodes.
   * If you specified index in first argument, it returns the only specified Node.
   */
  public get: {
    (): GomlTreeNodeBase[];
    (index: number): GomlTreeNodeBase;
    (index?: number): any;
  };

  /**
   * Get target Core Object which Node handles.
   *
   * It returns targeted Core Object in Node.
   * Not all Nodes are handling Core Object, so if it does not have, undefined will be returned.
   * If you specified index in first argument, it returns the only specified Node of Core Object.
   */
  public getObj: {
    <T>(): T[];
    <T>(index: number): T;
    <T>(argu?: number): any;
  };

  /**
   * WIP
   */
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

   /**
    * Find children recursively under specified condition.
    *
    * Selector string is given, find by same behavior as querySelectorAll.
    */
  public find: {
    (selector: string): J3Object;
    (node: GomlTreeNodeBase): J3Object;
    (j3obj: J3Object): J3Object;
    (argu: any): J3Object;
  };

  /**
   * Traversing/Filtering
   */

  public filter: {
    (selector: string): J3Object;
    (func: (index: number, node: GomlTreeNodeBase) => boolean): J3Object;
    (node: GomlTreeNodeBase): J3Object;
    (nodes: GomlTreeNodeBase[]): J3Object;
    (nodes: J3Object): J3Object;
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

  /**
   * Manipulation/NodeInsertion
   */

  public append: {
    (...contents: string[]): J3Object;
    (...contents: GomlTreeNodeBase[]): J3Object;
    (...contents: J3Object[]): J3Object;
    (...contents: string[][]): J3Object;
    (...contents: GomlTreeNodeBase[][]): J3Object;
    (...contents: J3Object[][]): J3Object;
    (func: (index: number, goml: string) => string): J3Object;
    (func: (index: number, goml: string) => GomlTreeNodeBase): J3Object;
    (func: (index: number, goml: string) => J3Object): J3Object;
    (...argu: any[]): J3Object;
  }
}

export default J3Object;
