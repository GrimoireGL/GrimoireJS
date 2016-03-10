import jThreeObject from "../Base/JThreeObject";
/**
 * Dictionary class to cache GOML node objects.
 */
class GomlNodeDictionary extends jThreeObject {
    constructor(...args) {
        super(...args);
        /**
         * Assosiative array that indexed by group and name, which assosiate GomlTreeNodeBase and callback functions.
         * @type {GomlTreeNodeBase}
         */
        this._dictionary = {};
        /**
         * Assosiative array that indexed by ID, which assosiate group and name string.
         * @type {string}
         */
        this._iDDictionary = {};
    }
    /**
     * add or update Object by group and name
     * @param {string}           group group string
     * @param {string}           name  name string
     * @param {GomlTreeNodeBase} obj   node object
     */
    addNode(group, name, node) {
        if (typeof group === "undefined" || typeof name === "undefined") {
            console.error(`group or name is undefined. group: ${group}, name: ${name}`);
        }
        // console.log("addNode", group, name, node);
        // register
        if (!this._dictionary[group]) {
            this._dictionary[group] = {};
        }
        if (!this._dictionary[group][name]) {
            this._dictionary[group][name] = { node: void 0, cb: [] };
        }
        const target = this._dictionary[group][name];
        const group_name = this._iDDictionary[node.ID];
        target.node = node;
        // when node is exist in other group and name
        if (group_name) {
            if (!(group_name.group === group && group_name.name === name)) {
                if (target.node.Mounted) {
                    // notify remove
                    this._dictionary[group_name.group][group_name.name].cb.forEach((fn) => { fn(null); });
                    // console.log("callWithNode(notify-remove)", null, `cb:${this.dictionary[group_name.group][group_name.name].cb.length}`);
                    delete this._dictionary[group_name.group][group_name.name];
                }
            }
        }
        this._iDDictionary[target.node.ID] = { group: group, name: name };
        if (target.node.Mounted) {
            // console.log("callWithNode(on-add)", target.node.getTypeName(), `cb:${target.cb.length}`);
            target.cb.forEach((fn) => { fn(target.node); });
        }
        else {
            target.node.on("on-mount", () => {
                // console.log("callWithNode(on-mount)", target.node.getTypeName(), `cb:${target.cb.length}`);
                target.cb.forEach((fn) => { fn(target.node); });
            });
        }
        target.node.on("on-unmount", () => {
            // console.log("callWithNode(on-mount)", null, `cb:${target.cb.length}`);
            target.cb.forEach((fn) => { fn(null); });
        });
    }
    /**
     * get node. callback function is call when target node is changed.
     * @param {string}                              group      group string
     * @param {string}                              name       name string
     * @param {(node: GomlTreeNodeBase) => void} callbackfn callback function for notifying node changes.
     */
    getNode(group, name, callbackfn) {
        if (typeof group === "undefined" || typeof name === "undefined") {
            console.error(`group or name is undefined. group: ${group}, name: ${name}`);
        }
        // console.log("getNode", group, name);
        // register
        if (!this._dictionary[group]) {
            this._dictionary[group] = {};
        }
        if (!this._dictionary[group][name]) {
            this._dictionary[group][name] = { node: void 0, cb: [] };
        }
        // console.log(this.dictionary);
        const target = this._dictionary[group][name];
        if (target.cb.length >= 10) {
            throw new Error("registered listeners count is over 10.");
        }
        else {
            target.cb.push(callbackfn);
        }
        // call immediately
        // console.log("callWithNode(on-get)", target.node ? (target.node.Mounted ? target.node : null) : undefined, `cb:${target.cb.length}`);
        callbackfn(target.node ? (target.node.Mounted ? target.node : null) : null);
    }
}
export default GomlNodeDictionary;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvR29tbE5vZGVEaWN0aW9uYXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLFlBQVksTUFBTSxzQkFBc0I7QUFHL0M7O0dBRUc7QUFDSCxpQ0FBaUMsWUFBWTtJQUE3QztRQUFpQyxlQUFZO1FBRTNDOzs7V0FHRztRQUNLLGdCQUFXLEdBQStHLEVBQUUsQ0FBQztRQUVySTs7O1dBR0c7UUFDSyxrQkFBYSxHQUF1RCxFQUFFLENBQUM7SUErRWpGLENBQUM7SUE3RUM7Ozs7O09BS0c7SUFDSSxPQUFPLENBQUMsS0FBYSxFQUFFLElBQVksRUFBRSxJQUFzQjtRQUNoRSxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxXQUFXLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNoRSxPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxLQUFLLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM5RSxDQUFDO1FBQ0QsNkNBQTZDO1FBQzdDLFdBQVc7UUFDWCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9CLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQzNELENBQUM7UUFDRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLE1BQU0sVUFBVSxHQUFH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LENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDM0QsQ0FBQztRQUNELGdDQUFnQztRQUNoQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFDRCxtQkFBbUI7UUFDbkIsdUlBQXVJO1FBQ3ZJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM5RSxDQUFDO0FBQ0gsQ0FBQztBQUVELGVBQWUsa0JBQWtCLENBQUMiLCJmaWxlIjoiR29tbC9Hb21sTm9kZURpY3Rpb25hcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgalRocmVlT2JqZWN0IGZyb20gXCIuLi9CYXNlL0pUaHJlZU9iamVjdFwiO1xuaW1wb3J0IEdvbWxUcmVlTm9kZUJhc2UgZnJvbSBcIi4vR29tbFRyZWVOb2RlQmFzZVwiO1xuXG4vKipcbiAqIERpY3Rpb25hcnkgY2xhc3MgdG8gY2FjaGUgR09NTCBub2RlIG9iamVjdHMuXG4gKi9cbmNsYXNzIEdvbWxOb2RlRGljdGlvbmFyeSBleHRlbmRzIGpUaHJlZU9iamVjdCB7XG5cbiAgLyoqXG4gICAqIEFzc29zaWF0aXZlIGFycmF5IHRoYXQgaW5kZXhlZCBieSBncm91cCBhbmQgbmFtZSwgd2hpY2ggYXNzb3NpYXRlIEdvbWxUcmVlTm9kZUJhc2UgYW5kIGNhbGxiYWNrIGZ1bmN0aW9ucy5cbiAgICogQHR5cGUge0dvbWxUcmVlTm9kZUJhc2V9XG4gICAqL1xuICBwcml2YXRlIF9kaWN0aW9uYXJ5OiB7IFtrZXk6IHN0cmluZ106IHsgW2tleTogc3RyaW5nXTogeyBub2RlOiBHb21sVHJlZU5vZGVCYXNlLCBjYjogKChub2RlOiBHb21sVHJlZU5vZGVCYXNlKSA9PiB2b2lkKVtdIH0gfSB9ID0ge307XG5cbiAgLyoqXG4gICAqIEFzc29zaWF0aXZlIGFycmF5IHRoYXQgaW5kZXhlZCBieSBJRCwgd2hpY2ggYXNzb3NpYXRlIGdyb3VwIGFuZCBuYW1lIHN0cmluZy5cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHByaXZhdGUgX2lERGljdGlvbmFyeTogeyBba2V5OiBzdHJpbmddOiB7IGdyb3VwOiBzdHJpbmcsIG5hbWU6IHN0cmluZyB9IH0gPSB7fTtcblxuICAvKipcbiAgICogYWRkIG9yIHVwZGF0ZSBPYmplY3QgYnkgZ3JvdXAgYW5kIG5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICBncm91cCBncm91cCBzdHJpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgICBuYW1lICBuYW1lIHN0cmluZ1xuICAgKiBAcGFyYW0ge0dvbWxUcmVlTm9kZUJhc2V9IG9iaiAgIG5vZGUgb2JqZWN0XG4gICAqL1xuICBwdWJsaWMgYWRkTm9kZShncm91cDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIG5vZGU6IEdvbWxUcmVlTm9kZUJhc2UpOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIGdyb3VwID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBuYW1lID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBncm91cCBvciBuYW1lIGlzIHVuZGVmaW5lZC4gZ3JvdXA6ICR7Z3JvdXB9LCBuYW1lOiAke25hbWV9YCk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKFwiYWRkTm9kZVwiLCBncm91cCwgbmFtZSwgbm9kZSk7XG4gICAgLy8gcmVnaXN0ZXJcbiAgICBpZiAoIXRoaXMuX2RpY3Rpb25hcnlbZ3JvdXBdKSB7XG4gICAgICB0aGlzLl9kaWN0aW9uYXJ5W2dyb3VwXSA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2RpY3Rpb25hcnlbZ3JvdXBdW25hbWVdKSB7XG4gICAgICB0aGlzLl9kaWN0aW9uYXJ5W2dyb3VwXVtuYW1lXSA9IHsgbm9kZTogdm9pZCAwLCBjYjogW10gfTtcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5fZGljdGlvbmFyeVtncm91cF1bbmFtZV07XG4gICAgY29uc3QgZ3JvdXBfbmFtZSA9IHRoaXMuX2lERGljdGlvbmFyeVtub2RlLklEXTtcbiAgICB0YXJnZXQubm9kZSA9IG5vZGU7XG4gICAgLy8gd2hlbiBub2RlIGlzIGV4aXN0IGluIG90aGVyIGdyb3VwIGFuZCBuYW1lXG4gICAgaWYgKGdyb3VwX25hbWUpIHtcbiAgICAgIGlmICghKGdyb3VwX25hbWUuZ3JvdXAgPT09IGdyb3VwICYmIGdyb3VwX25hbWUubmFtZSA9PT0gbmFtZSkpIHtcbiAgICAgICAgaWYgKHRhcmdldC5ub2RlLk1vdW50ZWQpIHtcbiAgICAgICAgICAvLyBub3RpZnkgcmVtb3ZlXG4gICAgICAgICAgdGhpcy5fZGljdGlvbmFyeVtncm91cF9uYW1lLmdyb3VwXVtncm91cF9uYW1lLm5hbWVdLmNiLmZvckVhY2goKGZuKSA9PiB7IGZuKG51bGwpOyB9KTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNhbGxXaXRoTm9kZShub3RpZnktcmVtb3ZlKVwiLCBudWxsLCBgY2I6JHt0aGlzLmRpY3Rpb25hcnlbZ3JvdXBfbmFtZS5ncm91cF1bZ3JvdXBfbmFtZS5uYW1lXS5jYi5sZW5ndGh9YCk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2RpY3Rpb25hcnlbZ3JvdXBfbmFtZS5ncm91cF1bZ3JvdXBfbmFtZS5uYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9pRERpY3Rpb25hcnlbdGFyZ2V0Lm5vZGUuSURdID0geyBncm91cDogZ3JvdXAsIG5hbWU6IG5hbWUgfTtcbiAgICBpZiAodGFyZ2V0Lm5vZGUuTW91bnRlZCkge1xuICAgICAgLy8gY29uc29sZS5sb2coXCJjYWxsV2l0aE5vZGUob24tYWRkKVwiLCB0YXJnZXQubm9kZS5nZXRUeXBlTmFtZSgpLCBgY2I6JHt0YXJnZXQuY2IubGVuZ3RofWApO1xuICAgICAgdGFyZ2V0LmNiLmZvckVhY2goKGZuKSA9PiB7IGZuKHRhcmdldC5ub2RlKTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5ub2RlLm9uKFwib24tbW91bnRcIiwgKCkgPT4geyAvLyBUT0RPIHBubHk6IGNoZWNrIGxpc3RlbmVyc1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNhbGxXaXRoTm9kZShvbi1tb3VudClcIiwgdGFyZ2V0Lm5vZGUuZ2V0VHlwZU5hbWUoKSwgYGNiOiR7dGFyZ2V0LmNiLmxlbmd0aH1gKTtcbiAgICAgICAgdGFyZ2V0LmNiLmZvckVhY2goKGZuKSA9PiB7IGZuKHRhcmdldC5ub2RlKTsgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGFyZ2V0Lm5vZGUub24oXCJvbi11bm1vdW50XCIsICgpID0+IHsgLy8gVE9ETyBwbmx5OiBjaGVjayBsaXN0ZW5lcnNcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2FsbFdpdGhOb2RlKG9uLW1vdW50KVwiLCBudWxsLCBgY2I6JHt0YXJnZXQuY2IubGVuZ3RofWApO1xuICAgICAgdGFyZ2V0LmNiLmZvckVhY2goKGZuKSA9PiB7IGZuKG51bGwpOyB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgbm9kZS4gY2FsbGJhY2sgZnVuY3Rpb24gaXMgY2FsbCB3aGVuIHRhcmdldCBub2RlIGlzIGNoYW5nZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwICAgICAgZ3JvdXAgc3RyaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgICAgICAgbmFtZSBzdHJpbmdcbiAgICogQHBhcmFtIHsobm9kZTogR29tbFRyZWVOb2RlQmFzZSkgPT4gdm9pZH0gY2FsbGJhY2tmbiBjYWxsYmFjayBmdW5jdGlvbiBmb3Igbm90aWZ5aW5nIG5vZGUgY2hhbmdlcy5cbiAgICovXG4gIHB1YmxpYyBnZXROb2RlKGdyb3VwOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgY2FsbGJhY2tmbjogKG5vZGU6IEdvbWxUcmVlTm9kZUJhc2UpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIGdyb3VwID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBuYW1lID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBncm91cCBvciBuYW1lIGlzIHVuZGVmaW5lZC4gZ3JvdXA6ICR7Z3JvdXB9LCBuYW1lOiAke25hbWV9YCk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKFwiZ2V0Tm9kZVwiLCBncm91cCwgbmFtZSk7XG4gICAgLy8gcmVnaXN0ZXJcbiAgICBpZiAoIXRoaXMuX2RpY3Rpb25hcnlbZ3JvdXBdKSB7XG4gICAgICB0aGlzLl9kaWN0aW9uYXJ5W2dyb3VwXSA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2RpY3Rpb25hcnlbZ3JvdXBdW25hbWVdKSB7XG4gICAgICB0aGlzLl9kaWN0aW9uYXJ5W2dyb3VwXVtuYW1lXSA9IHsgbm9kZTogdm9pZCAwLCBjYjogW10gfTtcbiAgICB9XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5kaWN0aW9uYXJ5KTtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLl9kaWN0aW9uYXJ5W2dyb3VwXVtuYW1lXTtcbiAgICBpZiAodGFyZ2V0LmNiLmxlbmd0aCA+PSAxMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVnaXN0ZXJlZCBsaXN0ZW5lcnMgY291bnQgaXMgb3ZlciAxMC5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5jYi5wdXNoKGNhbGxiYWNrZm4pO1xuICAgIH1cbiAgICAvLyBjYWxsIGltbWVkaWF0ZWx5XG4gICAgLy8gY29uc29sZS5sb2coXCJjYWxsV2l0aE5vZGUob24tZ2V0KVwiLCB0YXJnZXQubm9kZSA/ICh0YXJnZXQubm9kZS5Nb3VudGVkID8gdGFyZ2V0Lm5vZGUgOiBudWxsKSA6IHVuZGVmaW5lZCwgYGNiOiR7dGFyZ2V0LmNiLmxlbmd0aH1gKTtcbiAgICBjYWxsYmFja2ZuKHRhcmdldC5ub2RlID8gKHRhcmdldC5ub2RlLk1vdW50ZWQgPyB0YXJnZXQubm9kZSA6IG51bGwpIDogbnVsbCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR29tbE5vZGVEaWN0aW9uYXJ5O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
