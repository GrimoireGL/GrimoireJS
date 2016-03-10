import JThreeObject from "./JThreeObject";
import { InvalidArgumentException } from "../Exceptions";
/**
* The class for implementing in Event-Driven architecture.
*/
class JThreeEvent extends JThreeObject {
    constructor(...args) {
        super(...args);
        /**
        * The variable to contain handlers references.
        */
        this._eventHandlers = [];
    }
    /**
    * Call all of handler you subscribed.
    */
    fire(object, eventArg) {
        this._eventHandlers.forEach((h) => h(object, eventArg));
    }
    /**
    *Add the handler you pass.
    *@param handler the handler you want to add.
    */
    addListener(handler) {
        if (typeof handler === "undefined") {
            throw new InvalidArgumentException("you can not add undefined as event handler");
        }
        this._eventHandlers.push(handler);
    }
    /**
    * Remove the handler you passing.
    * @param handler the handler you want to remove.
    */
    removeListener(handler) {
        for (let i = 0; i < this._eventHandlers.length; i++) {
            const val = this._eventHandlers[i];
            if (val === handler) {
                this._eventHandlers.splice(i, 1);
                break;
            }
        }
    }
}
export default JThreeEvent;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2UvSlRocmVlRXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sWUFBWSxNQUFNLGdCQUFnQjtPQUVsQyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sZUFBZTtBQUN0RDs7RUFFRTtBQUNGLDBCQUE2QixZQUFZO0lBQXpDO1FBQTZCLGVBQVk7UUFDckM7O1VBRUU7UUFDTSxtQkFBYyxHQUFzQixFQUFFLENBQUM7SUFpQ25ELENBQUM7SUEvQkc7O01BRUU7SUFDSyxJQUFJLENBQUMsTUFBVyxFQUFFLFFBQVc7UUFDaEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRDs7O01BR0U7SUFDSyxXQUFXLENBQUMsT0FBd0I7UUFDdkMsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLElBQUksd0JBQXdCLENBQUMsNENBQTRDLENBQUMsQ0FBQztRQUNyRixDQUFDO1FBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVEOzs7TUFHRTtJQUNLLGNBQWMsQ0FBQyxPQUF3QjtRQUMxQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxLQUFLLENBQUM7WUFDVixDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7QUFDTCxDQUFDO0FBRUQsZUFBZSxXQUFXLENBQUMiLCJmaWxlIjoiQmFzZS9KVGhyZWVFdmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBKVGhyZWVPYmplY3QgZnJvbSBcIi4vSlRocmVlT2JqZWN0XCI7XG5pbXBvcnQge0FjdGlvbjJ9IGZyb20gXCIuLi9CYXNlL0RlbGVnYXRlc1wiO1xuaW1wb3J0IHtJbnZhbGlkQXJndW1lbnRFeGNlcHRpb259IGZyb20gXCIuLi9FeGNlcHRpb25zXCI7XG4vKipcbiogVGhlIGNsYXNzIGZvciBpbXBsZW1lbnRpbmcgaW4gRXZlbnQtRHJpdmVuIGFyY2hpdGVjdHVyZS5cbiovXG5jbGFzcyBKVGhyZWVFdmVudDxUPiBleHRlbmRzIEpUaHJlZU9iamVjdCB7XG4gICAgLyoqXG4gICAgKiBUaGUgdmFyaWFibGUgdG8gY29udGFpbiBoYW5kbGVycyByZWZlcmVuY2VzLlxuICAgICovXG4gICAgcHJpdmF0ZSBfZXZlbnRIYW5kbGVyczogQWN0aW9uMjxhbnksIFQ+W10gPSBbXTtcblxuICAgIC8qKlxuICAgICogQ2FsbCBhbGwgb2YgaGFuZGxlciB5b3Ugc3Vic2NyaWJlZC5cbiAgICAqL1xuICAgIHB1YmxpYyBmaXJlKG9iamVjdDogYW55LCBldmVudEFyZzogVCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9ldmVudEhhbmRsZXJzLmZvckVhY2goKGgpID0+IGgob2JqZWN0LCBldmVudEFyZykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICpBZGQgdGhlIGhhbmRsZXIgeW91IHBhc3MuXG4gICAgKkBwYXJhbSBoYW5kbGVyIHRoZSBoYW5kbGVyIHlvdSB3YW50IHRvIGFkZC5cbiAgICAqL1xuICAgIHB1YmxpYyBhZGRMaXN0ZW5lcihoYW5kbGVyOiBBY3Rpb24yPGFueSwgVD4pOiB2b2lkIHtcbiAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZEFyZ3VtZW50RXhjZXB0aW9uKFwieW91IGNhbiBub3QgYWRkIHVuZGVmaW5lZCBhcyBldmVudCBoYW5kbGVyXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2V2ZW50SGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFJlbW92ZSB0aGUgaGFuZGxlciB5b3UgcGFzc2luZy5cbiAgICAqIEBwYXJhbSBoYW5kbGVyIHRoZSBoYW5kbGVyIHlvdSB3YW50IHRvIHJlbW92ZS5cbiAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVMaXN0ZW5lcihoYW5kbGVyOiBBY3Rpb24yPGFueSwgVD4pOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9ldmVudEhhbmRsZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSB0aGlzLl9ldmVudEhhbmRsZXJzW2ldO1xuICAgICAgICAgICAgaWYgKHZhbCA9PT0gaGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50SGFuZGxlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBKVGhyZWVFdmVudDtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
