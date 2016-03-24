import jThreeObjectEE from "../Base/JThreeObjectEE";
import ContextComponents from "../ContextComponents";
import JThreeContext from "../JThreeContext";
/**
* The class for managing entire _scenes.
*/
class SceneManager extends jThreeObjectEE {
    constructor() {
        super();
        /**
         * All scene map. Hold by Scene.ID.
         */
        this._scenes = {};
        const loopManager = JThreeContext.getContextComponent(ContextComponents.LoopManager);
        loopManager.addAction(5000, () => this.renderAll());
    }
    getContextComponentIndex() {
        return ContextComponents.SceneManager;
    }
    /**
    * Add new scene to be managed.
    */
    addScene(scene) {
        if (!this._scenes[scene.ID]) {
            this._scenes[scene.ID] = scene;
            this.emit("change", {
                owner: this,
                isAdditionalChange: true,
                changedScene: scene
            });
        }
    }
    /**
     * All scene list this class is managing.
     */
    get Scenes() {
        const array = [];
        for (let scene in this._scenes) {
            array.push(this._scenes[scene]);
        }
        return array;
    }
    /**
    * Remove exisiting scene from managed.
    */
    removeScene(scene) {
        if (this._scenes[scene.ID]) {
            delete this._scenes[scene.ID];
            this.emit("change", {
                owner: this,
                isAdditionalChange: false,
                changedScene: scene
            });
        }
    }
    /**
     * Process render for all _scenes
     * This method is intended to be called by jThree system.
     * You don't need to call this method maually in most case.
     */
    renderAll() {
        for (let sceneId in this._scenes) {
            const scene = this._scenes[sceneId];
            scene.update();
            scene.render();
        }
    }
}
export default SceneManager;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvU2NlbmVNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLGNBQWMsTUFBTSx3QkFBd0I7T0FHNUMsaUJBQWlCLE1BQU0sc0JBQXNCO09BRTdDLGFBQWEsTUFBTSxrQkFBa0I7QUFHNUM7O0VBRUU7QUFDRiwyQkFBMkIsY0FBYztJQUV2QztRQUNFLE9BQU8sQ0FBQztRQUlWOztXQUVHO1FBQ0ssWUFBTyxHQUFpQyxFQUFFLENBQUM7UUFOakQsTUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDLG1CQUFtQixDQUFjLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xHLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQU1NLHdCQUF3QjtRQUM3QixNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7TUFFRTtJQUNLLFFBQVEsQ0FBQyxLQUFZO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsa0JBQWtCLEVBQUUsSUFBSTtnQkFDeEIsWUFBWSxFQUFFLEtBQUs7YUFDcEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFHRDs7T0FFRztJQUNILElBQVcsTUFBTTtRQUNmLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRDs7TUFFRTtJQUNLLFdBQVcsQ0FBQyxLQUFZO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNsQixLQUFLLEVBQUUsSUFBSTtnQkFDWCxrQkFBa0IsRUFBRSxLQUFLO2dCQUN6QixZQUFZLEVBQUUsS0FBSzthQUNwQixDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxTQUFTO1FBQ2QsR0FBRyxDQUFDLENBQUMsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakIsQ0FBQztJQUNILENBQUM7QUFFSCxDQUFDO0FBRUQsZUFBZSxZQUFZLENBQUMiLCJmaWxlIjoiQ29yZS9TY2VuZU1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgalRocmVlT2JqZWN0RUUgZnJvbSBcIi4uL0Jhc2UvSlRocmVlT2JqZWN0RUVcIjtcbmltcG9ydCBTY2VuZSBmcm9tIFwiLi9TY2VuZVwiO1xuaW1wb3J0IElDb250ZXh0Q29tcG9uZW50IGZyb20gXCIuLi9JQ29udGV4dENvbXBvbmVudFwiO1xuaW1wb3J0IENvbnRleHRDb21wb25lbnRzIGZyb20gXCIuLi9Db250ZXh0Q29tcG9uZW50c1wiO1xuaW1wb3J0IExvb3BNYW5hZ2VyIGZyb20gXCIuL0xvb3BNYW5hZ2VyXCI7XG5pbXBvcnQgSlRocmVlQ29udGV4dCBmcm9tIFwiLi4vSlRocmVlQ29udGV4dFwiO1xuXG5cbi8qKlxuKiBUaGUgY2xhc3MgZm9yIG1hbmFnaW5nIGVudGlyZSBfc2NlbmVzLlxuKi9cbmNsYXNzIFNjZW5lTWFuYWdlciBleHRlbmRzIGpUaHJlZU9iamVjdEVFIGltcGxlbWVudHMgSUNvbnRleHRDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgY29uc3QgbG9vcE1hbmFnZXIgPSBKVGhyZWVDb250ZXh0LmdldENvbnRleHRDb21wb25lbnQ8TG9vcE1hbmFnZXI+KENvbnRleHRDb21wb25lbnRzLkxvb3BNYW5hZ2VyKTtcbiAgICBsb29wTWFuYWdlci5hZGRBY3Rpb24oNTAwMCwgKCkgPT4gdGhpcy5yZW5kZXJBbGwoKSk7XG4gIH1cbiAgLyoqXG4gICAqIEFsbCBzY2VuZSBtYXAuIEhvbGQgYnkgU2NlbmUuSUQuXG4gICAqL1xuICBwcml2YXRlIF9zY2VuZXM6IHsgW3NjZW5lSUQ6IHN0cmluZ106IFNjZW5lIH0gPSB7fTtcblxuICBwdWJsaWMgZ2V0Q29udGV4dENvbXBvbmVudEluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIENvbnRleHRDb21wb25lbnRzLlNjZW5lTWFuYWdlcjtcbiAgfVxuXG4gIC8qKlxuICAqIEFkZCBuZXcgc2NlbmUgdG8gYmUgbWFuYWdlZC5cbiAgKi9cbiAgcHVibGljIGFkZFNjZW5lKHNjZW5lOiBTY2VuZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fc2NlbmVzW3NjZW5lLklEXSkge1xuICAgICAgdGhpcy5fc2NlbmVzW3NjZW5lLklEXSA9IHNjZW5lO1xuICAgICAgdGhpcy5lbWl0KFwiY2hhbmdlXCIsIHtcbiAgICAgICAgb3duZXI6IHRoaXMsXG4gICAgICAgIGlzQWRkaXRpb25hbENoYW5nZTogdHJ1ZSxcbiAgICAgICAgY2hhbmdlZFNjZW5lOiBzY2VuZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogQWxsIHNjZW5lIGxpc3QgdGhpcyBjbGFzcyBpcyBtYW5hZ2luZy5cbiAgICovXG4gIHB1YmxpYyBnZXQgU2NlbmVzKCk6IFNjZW5lW10ge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgZm9yIChsZXQgc2NlbmUgaW4gdGhpcy5fc2NlbmVzKSB7XG4gICAgICBhcnJheS5wdXNoKHRoaXMuX3NjZW5lc1tzY2VuZV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cblxuICAvKipcbiAgKiBSZW1vdmUgZXhpc2l0aW5nIHNjZW5lIGZyb20gbWFuYWdlZC5cbiAgKi9cbiAgcHVibGljIHJlbW92ZVNjZW5lKHNjZW5lOiBTY2VuZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9zY2VuZXNbc2NlbmUuSURdKSB7XG4gICAgICBkZWxldGUgdGhpcy5fc2NlbmVzW3NjZW5lLklEXTtcbiAgICAgIHRoaXMuZW1pdChcImNoYW5nZVwiLCB7XG4gICAgICAgIG93bmVyOiB0aGlzLFxuICAgICAgICBpc0FkZGl0aW9uYWxDaGFuZ2U6IGZhbHNlLFxuICAgICAgICBjaGFuZ2VkU2NlbmU6IHNjZW5lXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHJvY2VzcyByZW5kZXIgZm9yIGFsbCBfc2NlbmVzXG4gICAqIFRoaXMgbWV0aG9kIGlzIGludGVuZGVkIHRvIGJlIGNhbGxlZCBieSBqVGhyZWUgc3lzdGVtLlxuICAgKiBZb3UgZG9uJ3QgbmVlZCB0byBjYWxsIHRoaXMgbWV0aG9kIG1hdWFsbHkgaW4gbW9zdCBjYXNlLlxuICAgKi9cbiAgcHVibGljIHJlbmRlckFsbCgpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBzY2VuZUlkIGluIHRoaXMuX3NjZW5lcykge1xuICAgICAgY29uc3Qgc2NlbmUgPSB0aGlzLl9zY2VuZXNbc2NlbmVJZF07XG4gICAgICBzY2VuZS51cGRhdGUoKTtcbiAgICAgIHNjZW5lLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjZW5lTWFuYWdlcjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
