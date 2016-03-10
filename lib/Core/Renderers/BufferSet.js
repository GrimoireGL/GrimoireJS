import TextureGenerater from "./TextureGenerater";
/**
 * The class managing all buffer textures used for rendering in a BasicRenderer.
 */
class BufferSet {
    constructor(renderer) {
        /**
         * The color buffers managed by this class.
         */
        this._colorBuffers = {};
        this._renderer = renderer;
    }
    /**
     * Generate new buffer and append list.
     * @param {GeneraterInfoChunk} argument [description]
     */
    appendBuffer(argument) {
        if (this._colorBuffers[argument.name]) {
            console.error(`The color buffer ${argument.name} is already exist.`);
            return;
        }
        else {
            this._colorBuffers[argument.name] = TextureGenerater.generateTexture(this._renderer, argument);
        }
    }
    appendBuffers(args) {
        for (let i = 0; i < args.length; i++) {
            this.appendBuffer(args[i]);
        }
    }
    /**
     * Remove buffer and dispose.
     * @param {string} name [description]
     */
    removeBuffer(name) {
        if (this._colorBuffers[name]) {
            this._colorBuffers[name].dispose();
            delete this._colorBuffers[name];
        }
    }
    getColorBuffer(name) {
        return this._colorBuffers[name];
    }
}
export default BufferSet;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvUmVuZGVyZXJzL0J1ZmZlclNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FHTyxnQkFBZ0IsTUFBTSxvQkFBb0I7QUFDakQ7O0dBRUc7QUFDSDtJQVFFLFlBQVksUUFBdUI7UUFMbkM7O1dBRUc7UUFDSyxrQkFBYSxHQUFtQyxFQUFFLENBQUM7UUFHekQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFlBQVksQ0FBQyxRQUE0QjtRQUM5QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsUUFBUSxDQUFDLElBQUksb0JBQW9CLENBQUMsQ0FBQztZQUNyRSxNQUFNLENBQUM7UUFDVCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNqRyxDQUFDO0lBQ0gsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUEwQjtRQUM3QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNyQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLENBQUM7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksWUFBWSxDQUFDLElBQVk7UUFDOUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNuQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsQ0FBQztJQUNILENBQUM7SUFFTSxjQUFjLENBQUMsSUFBWTtRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0FBQ0gsQ0FBQztBQUVELGVBQWUsU0FBUyxDQUFDIiwiZmlsZSI6IkNvcmUvUmVuZGVyZXJzL0J1ZmZlclNldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNpY1JlbmRlcmVyIGZyb20gXCIuL0Jhc2ljUmVuZGVyZXJcIjtcbmltcG9ydCBHZW5lcmF0ZXJJbmZvQ2h1bmsgZnJvbSBcIi4vVGV4dHVyZUdlbmVyYXRlcnMvR2VuZXJhdGVySW5mb0NodW5rXCI7XG5pbXBvcnQgVGV4dHVyZUJhc2UgZnJvbSBcIi4uL1Jlc291cmNlcy9UZXh0dXJlL1RleHR1cmVCYXNlXCI7XG5pbXBvcnQgVGV4dHVyZUdlbmVyYXRlciBmcm9tIFwiLi9UZXh0dXJlR2VuZXJhdGVyXCI7XG4vKipcbiAqIFRoZSBjbGFzcyBtYW5hZ2luZyBhbGwgYnVmZmVyIHRleHR1cmVzIHVzZWQgZm9yIHJlbmRlcmluZyBpbiBhIEJhc2ljUmVuZGVyZXIuXG4gKi9cbmNsYXNzIEJ1ZmZlclNldCB7XG5cbiAgcHJpdmF0ZSBfcmVuZGVyZXI6IEJhc2ljUmVuZGVyZXI7XG4gIC8qKlxuICAgKiBUaGUgY29sb3IgYnVmZmVycyBtYW5hZ2VkIGJ5IHRoaXMgY2xhc3MuXG4gICAqL1xuICBwcml2YXRlIF9jb2xvckJ1ZmZlcnM6IHsgW2tleTogc3RyaW5nXTogVGV4dHVyZUJhc2UgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHJlbmRlcmVyOiBCYXNpY1JlbmRlcmVyKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBuZXcgYnVmZmVyIGFuZCBhcHBlbmQgbGlzdC5cbiAgICogQHBhcmFtIHtHZW5lcmF0ZXJJbmZvQ2h1bmt9IGFyZ3VtZW50IFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHB1YmxpYyBhcHBlbmRCdWZmZXIoYXJndW1lbnQ6IEdlbmVyYXRlckluZm9DaHVuayk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jb2xvckJ1ZmZlcnNbYXJndW1lbnQubmFtZV0pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFRoZSBjb2xvciBidWZmZXIgJHthcmd1bWVudC5uYW1lfSBpcyBhbHJlYWR5IGV4aXN0LmApO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jb2xvckJ1ZmZlcnNbYXJndW1lbnQubmFtZV0gPSBUZXh0dXJlR2VuZXJhdGVyLmdlbmVyYXRlVGV4dHVyZSh0aGlzLl9yZW5kZXJlciwgYXJndW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhcHBlbmRCdWZmZXJzKGFyZ3M6IEdlbmVyYXRlckluZm9DaHVua1tdKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmFwcGVuZEJ1ZmZlcihhcmdzW2ldKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGJ1ZmZlciBhbmQgZGlzcG9zZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgcHVibGljIHJlbW92ZUJ1ZmZlcihuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY29sb3JCdWZmZXJzW25hbWVdKSB7XG4gICAgICB0aGlzLl9jb2xvckJ1ZmZlcnNbbmFtZV0uZGlzcG9zZSgpO1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbG9yQnVmZmVyc1tuYW1lXTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29sb3JCdWZmZXIobmFtZTogc3RyaW5nKTogVGV4dHVyZUJhc2Uge1xuICAgIHJldHVybiB0aGlzLl9jb2xvckJ1ZmZlcnNbbmFtZV07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnVmZmVyU2V0O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
