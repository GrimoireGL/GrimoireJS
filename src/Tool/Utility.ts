import Environment from "../Core/Environment";
import Identity from "../Core/Identity";
import { Name } from "./Types";

/**
 * implement utility functions
 */
export default class Utility {

  /**
   * write warning if in debug-mode
   * @param message warning message
   */
  public static w(...message: string[]): void {
    if (Environment.GrimoireInterface.debug) {
      console.warn(...message);
    }
  }

  /**
   * Output debugging log to console if gr.debug is true.
   * @param message
   */
  public static log(...message: string[]): void {
    if (Environment.GrimoireInterface.debug) {
      console.debug(...message);
    }
  }
  /**
   * check string is CamelCase
   * @param str string to check
   */
  public static isCamelCase(str: string): boolean {
    return /^[A-Z][a-zA-Z0-9]*$/.test(str);
  }

  /**
   * check string is kebab-case
   * @param str string to check
   */
  public static isKebabCase(str: string): boolean {
    return /^[a-z0-9\-]+$/.test(str);
  }

  /**
   * array to be flat
   * @param array array
   */
  public static flat<T>(array: T[][]): T[] {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
      count += array[i].length;
    }
    const ret = new Array<T>(count);
    count = 0;
    for (let i = 0; i < array.length; i++) {
      const ar = array[i];
      for (let j = 0; j < ar.length; j++) {
        ret[count] = ar[j];
        count++;
      }
    }
    return ret;
  }

  /**
   * flatting result of map
   * @param source array
   * @param map map function
   */
  public static flatMap<T>(source: T[], map: (a: T) => T[]): T[] {
    const c = new Array<T[]>(source.length);
    for (let i = 0; i < source.length; i++) {
      c[i] = map(source[i]);
    }
    return Utility.flat(c);
  }

  /**
   * calculate sum of array
   * @param array array
   */
  public static sum(array: number[]): number {
    let total = 0;
    for (let i = 0; i < array.length; i++) {
      total += array[i];
    }
    return total;
  }

  /**
   * remove element from array if exists
   * @param array array
   * @param target remove target
   * @return success or not
   */
  public static remove<T>(array: T[], target: T): boolean {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
      if (target === array[i]) {
        index = i;
        break;
      }
    }
    if (index < 0) {
      return false;
    }
    array.splice(index, 1);
    return true;
  }

  /**
   * return true if array contain multiple same object
   * @param array array
   */
  public static checkOverlap<T>(array: T[]): boolean {
    const list = [];
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (list.indexOf(item) !== -1) {
        return false;
      }
      list.push(item);
    }
    return true;
  }

  /**
   * get node index by element index
   * @param targetElement element
   * @param elementIndex index of target element
   */
  public static getNodeListIndexByElementIndex(targetElement: Element, elementIndex: number): number {
    const nodeArray: Node[] = Array.prototype.slice.call(targetElement.childNodes);
    const elementArray = nodeArray.filter((v) => v.nodeType === 1);
    const updatedElementIndex = elementIndex < 0 ? elementArray.length + elementIndex : elementIndex;
    return nodeArray.indexOf(elementArray[updatedElementIndex]);
  }

  /**
   * get all attributes of element
   * @param element element
   */
  public static getAttributes(element: Element): { [key: string]: string } {
    const attributes: { [key: string]: string } = {};
    const domAttr = element.attributes;
    for (let i = 0; i < domAttr.length; i++) {
      const attrNode = domAttr.item(i);
      if (attrNode.name.startsWith("xmlns")) {
        continue;
      }
      const name = attrNode.namespaceURI ? `${attrNode.namespaceURI}.${attrNode.localName!}` : attrNode.localName!;
      attributes[name] = attrNode.value;
    }
    return attributes;
  }

  /**
   * Internal use!
   * throw error message if first argument is not TRUE.
   * @param shouldTrue
   * @param errorMessage
   */
  public static assert(shouldTrue: boolean, errorMessage: string) {
    if (!shouldTrue) {
      throw new Error(errorMessage);
    }
  }

  /**
   * chack node is Element
   * @param node
   */
  public static isElement(node: Node): node is Element {
    return node.nodeType === Environment.Node.ELEMENT_NODE;
  }

  /**
   * check obj is string or Identity
   * @param obj
   */
  public static isName(obj: any): obj is Name {
    return typeof obj === "string" || obj instanceof Identity;
  }
}
