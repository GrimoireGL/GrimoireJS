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
   * Assosiative array that indexed by group and name, which assosiate GomlTreeNodeBase and callback functions.
   * @type {GomlTreeNodeBase}
   */
  private dictionary: { [key: string]: { [key: string]: { node: GomlTreeNodeBase, cb: Delegates.Action1<GomlTreeNodeBase>[] } } } = {};

  /**
   * Assosiative array that indexed by ID, which assosiate group and name string.
   * @type {string}
   */
  private IDDictionary: { [key: string]: { group: string, name: string } } = {};

  /**
   * add or update Object by group and name
   * @param {string}           group group string
   * @param {string}           name  name string
   * @param {GomlTreeNodeBase} obj   node object
   */
  public addNode(group: string, name: string, node: GomlTreeNodeBase): void {
    if (group === undefined || name == undefined) {
      console.error(`group or name is undefined. group: ${group}, name: ${name}`);
    }
    console.log('addObject', group, name, node);
    // register
    if (!this.dictionary[group]) {
      this.dictionary[group] = {};
    }
    if (!this.dictionary[group][name]) {
      this.dictionary[group][name] = { node: undefined, cb: [] };
    }
    const target = this.dictionary[group][name];
    const group_name = this.IDDictionary[node.ID];
    target.node = node;
    // when node is exist in other group and name
    if (group_name) {
      if(!(group_name.group === group && group_name.name == name)) {
        if (target.node.Mounted) {
          // notify remove
          this.dictionary[group_name.group][group_name.name].cb.forEach((fn) => { fn(null); });
          delete this.dictionary[group_name.group][group_name.name];
        }
      }
    }
    this.IDDictionary[target.node.ID] = { group: group, name: name };
    target.node.on('on-mount', () => {
      target.cb.forEach((fn) => { fn(target.node); });
    });
    target.node.on('on-unmount', () => {
      target.cb.forEach((fn) => { fn(null); });
    });
  }

  /**
   * get node. callback function is call when target node is changed.
   * @param {string}                              group      group string
   * @param {string}                              name       name string
   * @param {Delegates.Action1<GomlTreeNodeBase>} callbackfn callback function for notifying node changes.
   */
  public getNode(group: string, name: string, callbackfn: Delegates.Action1<GomlTreeNodeBase>): void {
    if (group === undefined || name == undefined) {
      console.error(`group or name is undefined. group: ${group}, name: ${name}`);
    }
    console.log('getObject', group, name);
    // register
    if (!this.dictionary[group]) {
      this.dictionary[group] = {};
    }
    if (!this.dictionary[group][name]) {
      this.dictionary[group][name] = { node: undefined, cb: [] };
    }
    const target = this.dictionary[group][name];
    target.cb.push(callbackfn);
    // call immediately
    callbackfn(target.node ? target.node : null);
  }

  public checkUncalled(): void {
  }

}

export = GomlNodeDictionary;
