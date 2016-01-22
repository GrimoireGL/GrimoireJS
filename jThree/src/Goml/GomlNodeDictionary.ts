import jThreeObject = require("../Base/JThreeObject");
import GomlTreeNodeBase = require("./GomlTreeNodeBase");
import Delegates = require("../Base/Delegates");

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
    if (typeof group === "undefined" || typeof name === "undefined") {
      console.error(`group or name is undefined. group: ${group}, name: ${name}`);
    }
    // console.log("addNode", group, name, node);
    // register
    if (!this.dictionary[group]) {
      this.dictionary[group] = {};
    }
    if (!this.dictionary[group][name]) {
      this.dictionary[group][name] = { node: void 0, cb: [] };
    }
    const target = this.dictionary[group][name];
    const group_name = this.IDDictionary[node.ID];
    target.node = node;
    // when node is exist in other group and name
    if (group_name) {
      if (!(group_name.group === group && group_name.name === name)) {
        if (target.node.Mounted) {
          // notify remove
          this.dictionary[group_name.group][group_name.name].cb.forEach((fn) => { fn(null); });
          // console.log("callWithNode(notify-remove)", null, `cb:${this.dictionary[group_name.group][group_name.name].cb.length}`);
          delete this.dictionary[group_name.group][group_name.name];
        }
      }
    }
    this.IDDictionary[target.node.ID] = { group: group, name: name };
    if (target.node.Mounted) {
      // console.log("callWithNode(on-add)", target.node.getTypeName(), `cb:${target.cb.length}`);
      target.cb.forEach((fn) => { fn(target.node); });
    } else {
      target.node.on("on-mount", () => { // TODO pnly: check listeners
        // console.log("callWithNode(on-mount)", target.node.getTypeName(), `cb:${target.cb.length}`);
        target.cb.forEach((fn) => { fn(target.node); });
      });
    }
    target.node.on("on-unmount", () => { // TODO pnly: check listeners
      // console.log("callWithNode(on-mount)", null, `cb:${target.cb.length}`);
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
    if (typeof group === "undefined" || typeof name === "undefined") {
      console.error(`group or name is undefined. group: ${group}, name: ${name}`);
    }
    // console.log("getNode", group, name);
    // register
    if (!this.dictionary[group]) {
      this.dictionary[group] = {};
    }
    if (!this.dictionary[group][name]) {
      this.dictionary[group][name] = { node: void 0, cb: [] };
    }
    // console.log(this.dictionary);
    const target = this.dictionary[group][name];
    if (target.cb.length >= 10) {
      throw new Error("registered listeners count is over 10.");
    } else {
      target.cb.push(callbackfn);
    }
    // call immediately
    // console.log("callWithNode(on-get)", target.node ? (target.node.Mounted ? target.node : null) : undefined, `cb:${target.cb.length}`);
    callbackfn(target.node ? (target.node.Mounted ? target.node : null) : null);
  }

  // this method will be removed.
  public checkUncalled(): void {
    return;
  }

}

export = GomlNodeDictionary;
