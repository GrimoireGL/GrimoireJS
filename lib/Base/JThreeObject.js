import JsHack from "./JsHack";
/**
 * Most based object for any jthree related classes.
 * @type {[type]}
 */
class JThreeObject {
    /**
     * Obtain stringfied object.
     * If this method was not overridden, this method return class name.
     * @return {string} stringfied object
     */
    toString() {
        return JsHack.getObjectName(this);
    }
    /**
     * Obtain class name
     * @return {string} Class name of the instance.
     */
    getTypeName() {
        return JsHack.getObjectName(this);
    }
}
export default JThreeObject;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2UvSlRocmVlT2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLE1BQU0sTUFBTSxVQUFVO0FBQzdCOzs7R0FHRztBQUNIO0lBQ0k7Ozs7T0FJRztJQUNJLFFBQVE7UUFDWCxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksV0FBVztRQUNkLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7QUFDTCxDQUFDO0FBRUQsZUFBZSxZQUFZLENBQUMiLCJmaWxlIjoiQmFzZS9KVGhyZWVPYmplY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSnNIYWNrIGZyb20gXCIuL0pzSGFja1wiO1xuLyoqXG4gKiBNb3N0IGJhc2VkIG9iamVjdCBmb3IgYW55IGp0aHJlZSByZWxhdGVkIGNsYXNzZXMuXG4gKiBAdHlwZSB7W3R5cGVdfVxuICovXG5jbGFzcyBKVGhyZWVPYmplY3Qge1xuICAgIC8qKlxuICAgICAqIE9idGFpbiBzdHJpbmdmaWVkIG9iamVjdC5cbiAgICAgKiBJZiB0aGlzIG1ldGhvZCB3YXMgbm90IG92ZXJyaWRkZW4sIHRoaXMgbWV0aG9kIHJldHVybiBjbGFzcyBuYW1lLlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gc3RyaW5nZmllZCBvYmplY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIEpzSGFjay5nZXRPYmplY3ROYW1lKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9idGFpbiBjbGFzcyBuYW1lXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBDbGFzcyBuYW1lIG9mIHRoZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0VHlwZU5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIEpzSGFjay5nZXRPYmplY3ROYW1lKHRoaXMpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSlRocmVlT2JqZWN0O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
