import NamespacedIdentity from "./NamespacedIdentity";
import NamespacedDictionary from "./NamespacedDictionary";
/**
 * Provides static methods to ensure arguments are valid type.
 */
class Ensure {
  /**
   * Ensure specified str being string
   * @param  {string | number}      str [description]
   * @return {string}      [description]
   */
  public static ensureString(str: string | number): string {
    if (typeof str === "string") {
      return str;
    } else if (typeof str === "number") {
      return str.toString();
    } else {
      throw new Error("Specified argument can not convert into string");
    }
  }

  /**
   * Ensure specified number being number
   * @param  {string | number}      str [description]
   * @return {string}      [description]
   */
  public static ensureNumber(num: string | number): number {
    if (typeof num === "string") {
      return parseInt(num, 10);
    } else if (typeof num === "number") {
      return num;
    } else {
      throw new Error("specified argument can not be converted into number");
    }
  }

  public static ensureTobeNamespacedIdentity(name: string | NamespacedIdentity): NamespacedIdentity {
    if (!name) {
      return undefined;
    }
    if (typeof name === "string") {
      return new NamespacedIdentity(name);
    } else {
      return name;
    }
  }

  public static ensureTobeNamespacedIdentityArray(names: (string | NamespacedIdentity)[]): NamespacedIdentity[] {
    if (!names) {
      return [];
    }
    const newArr: NamespacedIdentity[] = [];
    for (let i = 0; i < names.length; i++) {
      newArr.push(this.ensureTobeNamespacedIdentity(names[i]));
    }
    return newArr;
  }

  public static ensureTobeNamespacedDictionary<T>(dict: NamespacedDictionary<T> | { [key: string]: T }, defaultNamespace: string): NamespacedDictionary<T> {
    if (!dict) {
      return new NamespacedDictionary<T>();
    }
    if (dict instanceof NamespacedDictionary) {
      return dict;
    } else {
      const newDict = new NamespacedDictionary<T>();
      for (let key in dict) {
        newDict.set(new NamespacedIdentity(defaultNamespace, key), dict[key]);
      }
      return newDict;
    }
  }
}

export default Ensure;
