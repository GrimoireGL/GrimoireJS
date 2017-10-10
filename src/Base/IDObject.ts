/**
 * Most based object for any Grimoire.js related classes.
 * @type {[type]}
 */
export default class IDObject {

  /**
   * Generate random string
   * @param  {number} length length of random string
   * @return {string}        generated string
   */
  public static getUniqueRandom(length: number): string {
    return Math.random().toString(36).slice(-length);
  }

  /**
   * ID related to this instance to identify.
   */
  public readonly id: string;

  constructor() {
    this.id = IDObject.getUniqueRandom(10);
  }
  /**
   * Obtain stringfied object.
   * If this method was not overridden, this method return class name.
   * @return {string} stringfied object
   */
  public toString(): string {
    return this.getTypeName();
  }

  /**
   * Obtain class name
   * @return {string} Class name of the instance.
   */
  public getTypeName(): string {
    const funcNameRegex = /function (.{1,})\(/;
    const result = (funcNameRegex).exec((this).constructor.toString());
    return (result && result.length > 1) ? result[1] : "";
  }
}
