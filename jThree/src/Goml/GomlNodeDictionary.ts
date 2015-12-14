import jThreeObject = require("../Base/JThreeObject");
import GomlTreeNodeBase = require("./GomlTreeNodeBase");
import AssociativeArray = require("../Base/Collections/AssociativeArray");
import JThreeEvent = require("../Base/JThreeEvent");
import Delegates = require("../Base/Delegates");
import JThreeLogger = require("../Base/JThreeLogger");
/**
 * Dictionary class to cache GOML node objects.
 */
class GomlNodeDictionary extends jThreeObject {
  /**
   * actual dictionary
   */
  private dictionary: AssociativeArray<AssociativeArray<GomlTreeNodeBase>> = new AssociativeArray<AssociativeArray<GomlTreeNodeBase>>();

  private cbDictionary: AssociativeArray<AssociativeArray<Delegates.Action1<GomlTreeNodeBase>[]>> = new AssociativeArray<AssociativeArray<Delegates.Action1<GomlTreeNodeBase>[]>>();

  private cbGroupDictionary: AssociativeArray<Delegates.Action1<AssociativeArray<GomlTreeNodeBase>>[]> = new AssociativeArray<Delegates.Action1<AssociativeArray<GomlTreeNodeBase>>[]>();
  /**
   * Add node object with group and name.
   */
  public addObject(group: string, name: string, obj: GomlTreeNodeBase): void {
    // register
    if (!this.dictionary.has(group)) {
      this.dictionary.set(group, new AssociativeArray<GomlTreeNodeBase>());
    }
    this.dictionary.get(group).set(name, obj);
    // callback
    if (this.cbGroupDictionary.has(group)) {
      this.cbGroupDictionary.get(group).forEach((cb) => {
        cb(this.dictionary.get(group));
      });
      this.cbGroupDictionary.delete(group);
    }
    if (this.cbDictionary.has(group) && this.cbDictionary.get(group).has(name)) {
      this.cbDictionary.get(group).get(name).forEach((cb) => {
        cb(this.dictionary.get(group).get(name));
      })
      this.cbDictionary.get(group).delete(name);
    }
  }

  public hasGroup(group: string): boolean {
    return this.dictionary.has(group);
  }

  /**
   * Get node object by group and name.
   */
  public getObject(group: string, name: string, callbackfn: Delegates.Action1<GomlTreeNodeBase>): void {
    if (this.dictionary.has(group) && this.dictionary.get(group).has(name)) {
      callbackfn(this.dictionary.get(group).get(name));
    } else {
      if (!this.cbDictionary.has(group)) {
        this.cbDictionary.set(group, new AssociativeArray<Delegates.Action1<GomlTreeNodeBase>[]>());
      }
      if (!this.cbDictionary.get(group).has(name)) {
        this.cbDictionary.get(group).set(name, []);
      }
      this.cbDictionary.get(group).get(name).push(callbackfn);
    }
  }

  public getGroupMap(group: string, callbackfn: Delegates.Action1<AssociativeArray<GomlTreeNodeBase>>): void {
    if (this.dictionary.has(group)) {
      callbackfn(this.dictionary.get(group));
    } else {
      this.cbGroupDictionary.get(group).push(callbackfn);
    }
  }

}

export = GomlNodeDictionary;
