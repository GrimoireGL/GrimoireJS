import JThreeObjectEEWithID from "../Base/JThreeObjectEEWithID";
/**
 * The most base class for GOML Tree
 *
 * events
 * child-added: 子が追加された時
 * child-removed: 子が削除された時
 * on-mount: 自分が有効なツリーに追加される直前。parentの参照が可能。
 * on-unmount: 自分が有効なツリーから削除される直前。parentの参照が可能。
 *
 * イベントの通知順序には注意が必要です。
 * 例として、あるNodeが子として追加された場合、子にparent-addedが呼ばれその次に自分自身にchild-addedが通知されます。
 *
 * また`this.mount`はwillではfalse, didではtrueです。
 */
class TreeNodeBase extends JThreeObjectEEWithID {
    constructor() {
        super();
        /**
         * the node array of this node
         */
        this.__children = [];
        /**
         * this property is true when this node is mouted to available tree.
         * @type {boolean}
         */
        this._mounted = false;
        this.on("child-added", (child) => {
            const cb = this.__onChildAdded;
            if (cb) {
                cb.bind(this)(child);
            }
        });
        this.on("child-removed", (child) => {
            const cb = this.__onChildRemoved;
            if (cb) {
                cb.bind(this)(child);
            }
        });
        this.on("on-mount", () => {
            const cb = this.__onMount;
            if (cb) {
                cb.bind(this)();
            }
        });
        this.on("on-unmount", () => {
            const cb = this.__onUnmount;
            if (cb) {
                cb.bind(this)();
            }
        });
    }
    /**
     * Execute delegate in each nodes recursively.
     * @param {TreeNodeBase) => void} act [description]
     */
    callRecursive(act) {
        act(this);
        this.__children.forEach((v) => {
            v.callRecursive(act);
        });
    }
    /**
     * Execute delegate in each nodes recursively with return value
     */
    callRecursiveWithReturn(act) {
        let ret = [];
        ret.push(act(this));
        this.__children.forEach((v) => {
            ret = ret.concat(v.callRecursiveWithReturn(act));
        });
        return ret;
    }
    /**
     * get mounted status
     * @return {boolean} [description]
     */
    get Mounted() {
        return this._mounted;
    }
    /**
     * update mounted status and emit events
     * @param {boolean} mounted [description]
     */
    set Mounted(mounted) {
        if (mounted && !this._mounted) {
            this._mounted = mounted;
            if (this._mounted) {
                this.emit("on-mount");
                this.emit("node-mount-process-finished", this._mounted); // this will be move
                this.__children.forEach((child) => {
                    child.Mounted = true;
                });
            }
            else {
                this.emit("on-unmount");
                this.emit("node-mount-process-finished", this._mounted); // this will be move
                this.__children.forEach((child) => {
                    child.Mounted = false;
                });
            }
        }
    }
    /**
     * Add child to this node
     */
    addChild(child) {
        child.__parent = this;
        this.__children.push(child);
        if (this.Mounted) {
            child.Mounted = true;
            this.emit("child-added", child);
        }
    }
    /**
     * remove child of this node
     * @param  {TreeNodeBase} child
     */
    removeChild(child) {
        for (let i = 0; i < this.__children.length; i++) {
            let v = this.__children[i];
            if (v === child) {
                child.__parent = null;
                this.__children.splice(i, 1);
                if (this.Mounted) {
                    child.Mounted = false;
                    this.emit("child-removed", child);
                }
                // TODO: events after-treatment
                child = null;
                break;
            }
        }
    }
    /**
     * remove myself
     */
    remove() {
        this.__parent.removeChild(this);
    }
    /**
     * This method is called when child is added
     * This method should be overridden.
     */
    __onChildAdded(child) {
        return;
    }
    ;
    /**
     * This method is called when child is removed
     * This method should be overridden.
     */
    __onChildRemoved(child) {
        return;
    }
    ;
    /**
     * This method is called when this node is mounted to available tree.
     * If you change attribute here, no events are fired.
     * This method should be overridden.
     */
    __onMount() {
        return;
    }
    ;
    /**
     * This method is called when this node is unmounted from available tree.
     * You can still access parent.
     * This method should be overridden.
     */
    __onUnmount() {
        return;
    }
    ;
}
export default TreeNodeBase;

//# sourceMappingURL=data:application/json;base64,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QUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNqQixLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3BDLENBQUM7Z0JBQ0QsK0JBQStCO2dCQUMvQixLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNiLEtBQUssQ0FBQztZQUNSLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTTtRQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7O09BR0c7SUFDTyxjQUFjLENBQUMsS0FBbUI7UUFDMUMsTUFBTSxDQUFDO0lBQ1QsQ0FBQzs7SUFFRDs7O09BR0c7SUFDTyxnQkFBZ0IsQ0FBQyxLQUFtQjtRQUM1QyxNQUFNLENBQUM7SUFDVCxDQUFDOztJQUVEOzs7O09BSUc7SUFDTyxTQUFTO1FBQ2pCLE1BQU0sQ0FBQztJQUNULENBQUM7O0lBRUQ7Ozs7T0FJRztJQUNPLFdBQVc7UUFDbkIsTUFBTSxDQUFDO0lBQ1QsQ0FBQzs7QUFDSCxDQUFDO0FBRUQsZUFBZSxZQUFZLENBQUMiLCJmaWxlIjoiR29tbC9UcmVlTm9kZUJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSlRocmVlT2JqZWN0RUVXaXRoSUQgZnJvbSBcIi4uL0Jhc2UvSlRocmVlT2JqZWN0RUVXaXRoSURcIjtcblxuLyoqXG4gKiBUaGUgbW9zdCBiYXNlIGNsYXNzIGZvciBHT01MIFRyZWVcbiAqXG4gKiBldmVudHNcbiAqIGNoaWxkLWFkZGVkOiDlrZDjgYzov73liqDjgZXjgozjgZ/mmYJcbiAqIGNoaWxkLXJlbW92ZWQ6IOWtkOOBjOWJiumZpOOBleOCjOOBn+aZglxuICogb24tbW91bnQ6IOiHquWIhuOBjOacieWKueOBquODhOODquODvOOBq+i/veWKoOOBleOCjOOCi+ebtOWJjeOAgnBhcmVudOOBruWPgueFp+OBjOWPr+iDveOAglxuICogb24tdW5tb3VudDog6Ieq5YiG44GM5pyJ5Yq544Gq44OE44Oq44O844GL44KJ5YmK6Zmk44GV44KM44KL55u05YmN44CCcGFyZW5044Gu5Y+C54Wn44GM5Y+v6IO944CCXG4gKlxuICog44Kk44OZ44Oz44OI44Gu6YCa55+l6aCG5bqP44Gr44Gv5rOo5oSP44GM5b+F6KaB44Gn44GZ44CCXG4gKiDkvovjgajjgZfjgabjgIHjgYLjgotOb2Rl44GM5a2Q44Go44GX44Gm6L+95Yqg44GV44KM44Gf5aC05ZCI44CB5a2Q44GrcGFyZW50LWFkZGVk44GM5ZG844Gw44KM44Gd44Gu5qyh44Gr6Ieq5YiG6Ieq6Lqr44GrY2hpbGQtYWRkZWTjgYzpgJrnn6XjgZXjgozjgb7jgZnjgIJcbiAqXG4gKiDjgb7jgZ9gdGhpcy5tb3VudGDjga93aWxs44Gn44GvZmFsc2UsIGRpZOOBp+OBr3RydWXjgafjgZnjgIJcbiAqL1xuY2xhc3MgVHJlZU5vZGVCYXNlIGV4dGVuZHMgSlRocmVlT2JqZWN0RUVXaXRoSUQge1xuICAvKipcbiAgICogdGhlIHBhcmVudCBub2RlIG9mIHRoaXMgbm9kZVxuICAgKi9cbiAgcHJvdGVjdGVkIF9fcGFyZW50OiBUcmVlTm9kZUJhc2U7XG5cbiAgLyoqXG4gICAqIHRoZSBub2RlIGFycmF5IG9mIHRoaXMgbm9kZVxuICAgKi9cbiAgcHJvdGVjdGVkIF9fY2hpbGRyZW46IFRyZWVOb2RlQmFzZVtdID0gW107XG5cbiAgLyoqXG4gICAqIHRoaXMgcHJvcGVydHkgaXMgdHJ1ZSB3aGVuIHRoaXMgbm9kZSBpcyBtb3V0ZWQgdG8gYXZhaWxhYmxlIHRyZWUuXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgcHJpdmF0ZSBfbW91bnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5vbihcImNoaWxkLWFkZGVkXCIsIChjaGlsZCkgPT4ge1xuICAgICAgY29uc3QgY2IgPSB0aGlzLl9fb25DaGlsZEFkZGVkO1xuICAgICAgaWYgKGNiKSB7IGNiLmJpbmQodGhpcykoY2hpbGQpOyB9XG4gICAgfSk7XG4gICAgdGhpcy5vbihcImNoaWxkLXJlbW92ZWRcIiwgKGNoaWxkKSA9PiB7XG4gICAgICBjb25zdCBjYiA9IHRoaXMuX19vbkNoaWxkUmVtb3ZlZDtcbiAgICAgIGlmIChjYikgeyBjYi5iaW5kKHRoaXMpKGNoaWxkKTsgfVxuICAgIH0pO1xuICAgIHRoaXMub24oXCJvbi1tb3VudFwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBjYiA9IHRoaXMuX19vbk1vdW50O1xuICAgICAgaWYgKGNiKSB7IGNiLmJpbmQodGhpcykoKTsgfVxuICAgIH0pO1xuICAgIHRoaXMub24oXCJvbi11bm1vdW50XCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGNiID0gdGhpcy5fX29uVW5tb3VudDtcbiAgICAgIGlmIChjYikgeyBjYi5iaW5kKHRoaXMpKCk7IH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGRlbGVnYXRlIGluIGVhY2ggbm9kZXMgcmVjdXJzaXZlbHkuXG4gICAqIEBwYXJhbSB7VHJlZU5vZGVCYXNlKSA9PiB2b2lkfSBhY3QgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgcHVibGljIGNhbGxSZWN1cnNpdmUoYWN0OiAobm9kZTogVHJlZU5vZGVCYXNlKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgYWN0KHRoaXMpO1xuICAgIHRoaXMuX19jaGlsZHJlbi5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICB2LmNhbGxSZWN1cnNpdmUoYWN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGRlbGVnYXRlIGluIGVhY2ggbm9kZXMgcmVjdXJzaXZlbHkgd2l0aCByZXR1cm4gdmFsdWVcbiAgICovXG4gIHB1YmxpYyBjYWxsUmVjdXJzaXZlV2l0aFJldHVybjxUPihhY3Q6IChub2RlOiBUcmVlTm9kZUJhc2UpID0+IFQpOiBUW10ge1xuICAgIGxldCByZXQ6IFRbXSA9IFtdO1xuICAgIHJldC5wdXNoKGFjdCh0aGlzKSk7XG4gICAgdGhpcy5fX2NoaWxkcmVuLmZvckVhY2goKHYpID0+IHtcbiAgICAgIHJldCA9IHJldC5jb25jYXQodi5jYWxsUmVjdXJzaXZlV2l0aFJldHVybjxUPihhY3QpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCBtb3VudGVkIHN0YXR1c1xuICAgKiBAcmV0dXJuIHtib29sZWFufSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBwdWJsaWMgZ2V0IE1vdW50ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX21vdW50ZWQ7XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlIG1vdW50ZWQgc3RhdHVzIGFuZCBlbWl0IGV2ZW50c1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1vdW50ZWQgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgcHVibGljIHNldCBNb3VudGVkKG1vdW50ZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAobW91bnRlZCAmJiAhdGhpcy5fbW91bnRlZCkge1xuICAgICAgdGhpcy5fbW91bnRlZCA9IG1vdW50ZWQ7XG4gICAgICBpZiAodGhpcy5fbW91bnRlZCkge1xuICAgICAgICB0aGlzLmVtaXQoXCJvbi1tb3VudFwiKTtcbiAgICAgICAgdGhpcy5lbWl0KFwibm9kZS1tb3VudC1wcm9jZXNzLWZpbmlzaGVkXCIsIHRoaXMuX21vdW50ZWQpOyAvLyB0aGlzIHdpbGwgYmUgbW92ZVxuICAgICAgICB0aGlzLl9fY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICBjaGlsZC5Nb3VudGVkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVtaXQoXCJvbi11bm1vdW50XCIpO1xuICAgICAgICB0aGlzLmVtaXQoXCJub2RlLW1vdW50LXByb2Nlc3MtZmluaXNoZWRcIiwgdGhpcy5fbW91bnRlZCk7IC8vIHRoaXMgd2lsbCBiZSBtb3ZlXG4gICAgICAgIHRoaXMuX19jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgIGNoaWxkLk1vdW50ZWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblx0LyoqXG5cdCAqIEFkZCBjaGlsZCB0byB0aGlzIG5vZGVcblx0ICovXG4gIHB1YmxpYyBhZGRDaGlsZChjaGlsZDogVHJlZU5vZGVCYXNlKTogdm9pZCB7XG4gICAgY2hpbGQuX19wYXJlbnQgPSB0aGlzO1xuICAgIHRoaXMuX19jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICBpZiAodGhpcy5Nb3VudGVkKSB7XG4gICAgICBjaGlsZC5Nb3VudGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZW1pdChcImNoaWxkLWFkZGVkXCIsIGNoaWxkKTtcbiAgICB9XG4gIH1cblxuXHQvKipcblx0ICogcmVtb3ZlIGNoaWxkIG9mIHRoaXMgbm9kZVxuXHQgKiBAcGFyYW0gIHtUcmVlTm9kZUJhc2V9IGNoaWxkXG5cdCAqL1xuICBwdWJsaWMgcmVtb3ZlQ2hpbGQoY2hpbGQ6IFRyZWVOb2RlQmFzZSk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fX2NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgdiA9IHRoaXMuX19jaGlsZHJlbltpXTtcbiAgICAgIGlmICh2ID09PSBjaGlsZCkge1xuICAgICAgICBjaGlsZC5fX3BhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuX19jaGlsZHJlbi5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGlmICh0aGlzLk1vdW50ZWQpIHtcbiAgICAgICAgICBjaGlsZC5Nb3VudGVkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5lbWl0KFwiY2hpbGQtcmVtb3ZlZFwiLCBjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogZXZlbnRzIGFmdGVyLXRyZWF0bWVudFxuICAgICAgICBjaGlsZCA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiByZW1vdmUgbXlzZWxmXG4gICAqL1xuICBwdWJsaWMgcmVtb3ZlKCk6IHZvaWQge1xuICAgIHRoaXMuX19wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gY2hpbGQgaXMgYWRkZWRcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRkZW4uXG4gICAqL1xuICBwcm90ZWN0ZWQgX19vbkNoaWxkQWRkZWQoY2hpbGQ6IFRyZWVOb2RlQmFzZSk6IHZvaWQge1xuICAgIHJldHVybjtcbiAgfTtcblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHdoZW4gY2hpbGQgaXMgcmVtb3ZlZFxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgb3ZlcnJpZGRlbi5cbiAgICovXG4gIHByb3RlY3RlZCBfX29uQ2hpbGRSZW1vdmVkKGNoaWxkOiBUcmVlTm9kZUJhc2UpOiB2b2lkIHtcbiAgICByZXR1cm47XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCB3aGVuIHRoaXMgbm9kZSBpcyBtb3VudGVkIHRvIGF2YWlsYWJsZSB0cmVlLlxuICAgKiBJZiB5b3UgY2hhbmdlIGF0dHJpYnV0ZSBoZXJlLCBubyBldmVudHMgYXJlIGZpcmVkLlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgb3ZlcnJpZGRlbi5cbiAgICovXG4gIHByb3RlY3RlZCBfX29uTW91bnQoKTogdm9pZCB7XG4gICAgcmV0dXJuO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiB0aGlzIG5vZGUgaXMgdW5tb3VudGVkIGZyb20gYXZhaWxhYmxlIHRyZWUuXG4gICAqIFlvdSBjYW4gc3RpbGwgYWNjZXNzIHBhcmVudC5cbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRkZW4uXG4gICAqL1xuICBwcm90ZWN0ZWQgX19vblVubW91bnQoKTogdm9pZCB7XG4gICAgcmV0dXJuO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBUcmVlTm9kZUJhc2U7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
