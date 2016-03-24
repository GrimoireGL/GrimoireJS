import JThreeObject from "./JThreeObject";
/**
 * Unique ID generator for jThree objects.
 * @type {[type]}
 */
class JThreeID extends JThreeObject {
    /**
     * Generate random string
     * @param  {number} length length of random string
     * @return {string}        generated string
     */
    static getUniqueRandom(length) {
        let random = "";
        for (let i = 0; i < length; i++) {
            random += JThreeID._randomChars.charAt(Math.random() * JThreeID._randomChars.length);
        }
        return random;
    }
}
/**
 * Random characters being used for generating unique id.
 * @type {string}
 */
JThreeID._randomChars = "abcdefghijklmnopqrstuvwxyzABCDEFHIJKLMNOPQRSTUVWXYZ1234567890-";
export default JThreeID;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2UvSlRocmVlSUQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sWUFBWSxNQUFNLGdCQUFnQjtBQUN6Qzs7O0dBR0c7QUFDSCx1QkFBdUIsWUFBWTtJQU8vQjs7OztPQUlHO0lBQ0gsT0FBYyxlQUFlLENBQUMsTUFBYztRQUN4QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QixNQUFNLElBQUksUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekYsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztBQUNMLENBQUM7QUFsQkc7OztHQUdHO0FBQ1kscUJBQVksR0FBVyxnRUFBZ0UsQ0Fjekc7QUFFRCxlQUFlLFFBQVEsQ0FBQyIsImZpbGUiOiJCYXNlL0pUaHJlZUlELmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEpUaHJlZU9iamVjdCBmcm9tIFwiLi9KVGhyZWVPYmplY3RcIjtcbi8qKlxuICogVW5pcXVlIElEIGdlbmVyYXRvciBmb3IgalRocmVlIG9iamVjdHMuXG4gKiBAdHlwZSB7W3R5cGVdfVxuICovXG5jbGFzcyBKVGhyZWVJRCBleHRlbmRzIEpUaHJlZU9iamVjdCB7XG4gICAgLyoqXG4gICAgICogUmFuZG9tIGNoYXJhY3RlcnMgYmVpbmcgdXNlZCBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgaWQuXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICBwcml2YXRlIHN0YXRpYyBfcmFuZG9tQ2hhcnM6IHN0cmluZyA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZISUpLTE1OT1BRUlNUVVZXWFlaMTIzNDU2Nzg5MC1cIjtcblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIHJhbmRvbSBzdHJpbmdcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGxlbmd0aCBsZW5ndGggb2YgcmFuZG9tIHN0cmluZ1xuICAgICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgIGdlbmVyYXRlZCBzdHJpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldFVuaXF1ZVJhbmRvbShsZW5ndGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIGxldCByYW5kb20gPSBcIlwiO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByYW5kb20gKz0gSlRocmVlSUQuX3JhbmRvbUNoYXJzLmNoYXJBdChNYXRoLnJhbmRvbSgpICogSlRocmVlSUQuX3JhbmRvbUNoYXJzLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJhbmRvbTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEpUaHJlZUlEO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
