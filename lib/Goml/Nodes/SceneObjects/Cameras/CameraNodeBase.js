import SceneObjectNodeBase from "../SceneObjectNodeBase";
class CameraNodeBase extends SceneObjectNodeBase {
    constructor() {
        super();
        this.__groupPrefix = "camera";
        this.attributes.getAttribute("name").on("changed", this._onNameAttrChanged.bind(this));
    }
    /**
     * Construct camera. This method should be overridden.
     * @return {Camera} [description]
     */
    __constructCamera() {
        return null;
    }
    /**
     * Construct camera and set to TargetSceneObject.
     * This Node is exported.
     */
    __onMount() {
        super.__onMount();
        this.TargetSceneObject = this.__constructCamera();
    }
    /**
     * Export node when name attribute changed.
     * @param {GomlAttribute} attr [description]
     */
    _onNameAttrChanged(attr) {
        const name = attr.Value;
        if (typeof name !== "string") {
            throw Error(`${this.getTypeName()}: name attribute must be required.`);
        }
        this.nodeExport(name);
        attr.done();
    }
}
export default CameraNodeBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZXMvU2NlbmVPYmplY3RzL0NhbWVyYXMvQ2FtZXJhTm9kZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sbUJBQW1CLE1BQU0sd0JBQXdCO0FBSXhELDZCQUErQyxtQkFBbUI7SUFHaEU7UUFDRSxPQUFPLENBQUM7UUFIQSxrQkFBYSxHQUFXLFFBQVEsQ0FBQztRQUl6QyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRUQ7OztPQUdHO0lBQ08saUJBQWlCO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sU0FBUztRQUNqQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQ3BELENBQUM7SUFFRDs7O09BR0c7SUFDSyxrQkFBa0IsQ0FBQyxJQUFtQjtRQUM1QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3hCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLG9DQUFvQyxDQUFDLENBQUM7UUFDekUsQ0FBQztRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLGNBQWMsQ0FBQyIsImZpbGUiOiJHb21sL05vZGVzL1NjZW5lT2JqZWN0cy9DYW1lcmFzL0NhbWVyYU5vZGVCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNjZW5lT2JqZWN0Tm9kZUJhc2UgZnJvbSBcIi4uL1NjZW5lT2JqZWN0Tm9kZUJhc2VcIjtcbmltcG9ydCBDYW1lcmEgZnJvbSBcIi4uLy4uLy4uLy4uL0NvcmUvU2NlbmVPYmplY3RzL0NhbWVyYS9DYW1lcmFcIjtcbmltcG9ydCBHb21sQXR0cmlidXRlIGZyb20gXCIuLi8uLi8uLi9Hb21sQXR0cmlidXRlXCI7XG5cbmNsYXNzIENhbWVyYU5vZGVCYXNlPFQgZXh0ZW5kcyBDYW1lcmE+IGV4dGVuZHMgU2NlbmVPYmplY3ROb2RlQmFzZTxUPiB7XG4gIHByb3RlY3RlZCBfX2dyb3VwUHJlZml4OiBzdHJpbmcgPSBcImNhbWVyYVwiO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5hdHRyaWJ1dGVzLmdldEF0dHJpYnV0ZShcIm5hbWVcIikub24oXCJjaGFuZ2VkXCIsIHRoaXMuX29uTmFtZUF0dHJDaGFuZ2VkLmJpbmQodGhpcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBjYW1lcmEuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZGVuLlxuICAgKiBAcmV0dXJuIHtDYW1lcmF9IFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHByb3RlY3RlZCBfX2NvbnN0cnVjdENhbWVyYSgpOiBUIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgY2FtZXJhIGFuZCBzZXQgdG8gVGFyZ2V0U2NlbmVPYmplY3QuXG4gICAqIFRoaXMgTm9kZSBpcyBleHBvcnRlZC5cbiAgICovXG4gIHByb3RlY3RlZCBfX29uTW91bnQoKTogdm9pZCB7XG4gICAgc3VwZXIuX19vbk1vdW50KCk7XG4gICAgdGhpcy5UYXJnZXRTY2VuZU9iamVjdCA9IHRoaXMuX19jb25zdHJ1Y3RDYW1lcmEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvcnQgbm9kZSB3aGVuIG5hbWUgYXR0cmlidXRlIGNoYW5nZWQuXG4gICAqIEBwYXJhbSB7R29tbEF0dHJpYnV0ZX0gYXR0ciBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBwcml2YXRlIF9vbk5hbWVBdHRyQ2hhbmdlZChhdHRyOiBHb21sQXR0cmlidXRlKTogdm9pZCB7XG4gICAgY29uc3QgbmFtZSA9IGF0dHIuVmFsdWU7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICB0aHJvdyBFcnJvcihgJHt0aGlzLmdldFR5cGVOYW1lKCl9OiBuYW1lIGF0dHJpYnV0ZSBtdXN0IGJlIHJlcXVpcmVkLmApO1xuICAgIH1cbiAgICB0aGlzLm5vZGVFeHBvcnQobmFtZSk7XG4gICAgYXR0ci5kb25lKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FtZXJhTm9kZUJhc2U7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
