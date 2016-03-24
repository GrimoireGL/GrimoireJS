/**
 * Something tricky static methods for javascript.
 */
class JsHack {
    /**
     * Obtain the class name of passed object.
     * @param  {any}    obj any object to get class name for
     * @return {string}   obtained name
     */
    static getObjectName(obj) {
        const funcNameRegex = /function (.{1,})\(/;
        const result = (funcNameRegex).exec((obj).constructor.toString());
        return (result && result.length > 1) ? result[1] : "";
    }
}
export default JsHack;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2UvSnNIYWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBQ0g7SUFDSTs7OztPQUlHO0lBQ0gsT0FBYyxhQUFhLENBQUMsR0FBUTtRQUNoQyxNQUFNLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQztRQUMzQyxNQUFNLE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDMUQsQ0FBQztBQUNMLENBQUM7QUFFRCxlQUFlLE1BQU0sQ0FBQyIsImZpbGUiOiJCYXNlL0pzSGFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU29tZXRoaW5nIHRyaWNreSBzdGF0aWMgbWV0aG9kcyBmb3IgamF2YXNjcmlwdC5cbiAqL1xuY2xhc3MgSnNIYWNrIHtcbiAgICAvKipcbiAgICAgKiBPYnRhaW4gdGhlIGNsYXNzIG5hbWUgb2YgcGFzc2VkIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gIHthbnl9ICAgIG9iaiBhbnkgb2JqZWN0IHRvIGdldCBjbGFzcyBuYW1lIGZvclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gICBvYnRhaW5lZCBuYW1lXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmplY3ROYW1lKG9iajogYW55KTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoLztcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gKGZ1bmNOYW1lUmVnZXgpLmV4ZWMoKG9iaikuY29uc3RydWN0b3IudG9TdHJpbmcoKSk7XG4gICAgICAgIHJldHVybiAocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPiAxKSA/IHJlc3VsdFsxXSA6IFwiXCI7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBKc0hhY2s7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
