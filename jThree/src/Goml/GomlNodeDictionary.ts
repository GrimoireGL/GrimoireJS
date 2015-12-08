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

  private onGroupMemberChanged: AssociativeArray<JThreeEvent<GomlTreeNodeBase>> = new AssociativeArray<JThreeEvent<GomlTreeNodeBase>>();
  /**
   * Add node object with group and name.
   */
  public addObject(group: string, name: string, obj: GomlTreeNodeBase): void {
    if (!this.dictionary.has(group))//If there was no such group
    {
      this.dictionary.set(group, new AssociativeArray<GomlTreeNodeBase>());
      this.onGroupMemberChanged.set(group, new JThreeEvent<GomlTreeNodeBase>());
    }
    this.dictionary.get(group).set(name, obj);
    this.onGroupMemberChanged.get(group).fire(this, obj);
  }

  public hasGroup(group: string): boolean {
    return this.dictionary.has(group);
  }

  /**
   * Get node object by group and name.
   */
  public getObject<T extends GomlTreeNodeBase>(group: string, name: string): T {
    if (!this.dictionary.has(group)) {
      JThreeLogger.sectionError("GOML loader", `Unknown group name '${group}' was requested.`);
      return null;
    } else {
      return <T>this.dictionary.get(group).get(name);
    }
  }

  public getGroupMap<T extends GomlTreeNodeBase>(group: string): AssociativeArray<T> {
    return <AssociativeArray<T>>this.dictionary.get(group);
  }

  public onGroupObjectChanged(group: string, handler: Delegates.Action1<GomlTreeNodeBase>) {
    if (this.hasGroup(group)) {
      this.onGroupMemberChanged.get(group).addListener(handler);
    } else {
      console.warn("there is no such group");
    }
  }
}

export =GomlNodeDictionary;
