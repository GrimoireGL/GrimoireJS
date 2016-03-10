import Vector4 from "../Math/Vector4";
import Color4 from "../Math/Color4";
import Vector3 from "../Math/Vector3";
import Color3 from "../Math/Color3";
class VectorColorCombinedParser {
    static parseTuple3(source) {
        const asColor = Color3.parse(source);
        if (typeof asColor !== "undefined") {
            return asColor;
        }
        return Vector3.parse(source);
    }
    static parseTuple4(source) {
        const asColor = Color4.parse(source);
        if (typeof asColor !== "undefined") {
            return asColor;
        }
        return Vector4.parse(source);
    }
}
export default VectorColorCombinedParser;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvVmVjdG9yQ29sb3JDb21iaW5lZFBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxPQUFPLE1BQU0saUJBQWlCO09BQzlCLE1BQU0sTUFBTSxnQkFBZ0I7T0FDNUIsT0FBTyxNQUFNLGlCQUFpQjtPQUM5QixNQUFNLE1BQU0sZ0JBQWdCO0FBR25DO0lBQ0UsT0FBYyxXQUFXLENBQUMsTUFBYztRQUN0QyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELE9BQWMsV0FBVyxDQUFDLE1BQWM7UUFDdEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQyxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7QUFDSCxDQUFDO0FBRUQsZUFBZSx5QkFBeUIsQ0FBQyIsImZpbGUiOiJHb21sL1ZlY3RvckNvbG9yQ29tYmluZWRQYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmVjdG9yNCBmcm9tIFwiLi4vTWF0aC9WZWN0b3I0XCI7XG5pbXBvcnQgQ29sb3I0IGZyb20gXCIuLi9NYXRoL0NvbG9yNFwiO1xuaW1wb3J0IFZlY3RvcjMgZnJvbSBcIi4uL01hdGgvVmVjdG9yM1wiO1xuaW1wb3J0IENvbG9yMyBmcm9tIFwiLi4vTWF0aC9Db2xvcjNcIjtcbmltcG9ydCBWZWN0b3JCYXNlIGZyb20gXCIuLi9NYXRoL1ZlY3RvckJhc2VcIjtcblxuY2xhc3MgVmVjdG9yQ29sb3JDb21iaW5lZFBhcnNlciB7XG4gIHB1YmxpYyBzdGF0aWMgcGFyc2VUdXBsZTMoc291cmNlOiBzdHJpbmcpOiBWZWN0b3JCYXNlIHtcbiAgICBjb25zdCBhc0NvbG9yID0gQ29sb3IzLnBhcnNlKHNvdXJjZSk7XG4gICAgaWYgKHR5cGVvZiBhc0NvbG9yICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gYXNDb2xvcjtcbiAgICB9XG4gICAgcmV0dXJuIFZlY3RvcjMucGFyc2Uoc291cmNlKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgcGFyc2VUdXBsZTQoc291cmNlOiBzdHJpbmcpOiBWZWN0b3JCYXNlIHtcbiAgICBjb25zdCBhc0NvbG9yID0gQ29sb3I0LnBhcnNlKHNvdXJjZSk7XG4gICAgaWYgKHR5cGVvZiBhc0NvbG9yICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gYXNDb2xvcjtcbiAgICB9XG4gICAgcmV0dXJuIFZlY3RvcjQucGFyc2Uoc291cmNlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBWZWN0b3JDb2xvckNvbWJpbmVkUGFyc2VyO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9