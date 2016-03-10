import J3Object from "./J3Object";
import GomlNodeMethods from "./Miscellaneous/GomlNodeMethods";
import TreeTraversal from "./Traversing/TreeTraversal";
import GeneralAttributes from "./Manipulation/GeneralAttributes";
import CollectionManipulation from "./Manipulation/CollectionManipulation";
import Utilities from "./Static/Utilities";
import Find from "./Static/Find";
function J3ObjectMixins() {
    const mixins = [
        GomlNodeMethods,
        TreeTraversal,
        GeneralAttributes,
        CollectionManipulation,
    ];
    const staticMixins = [
        Find,
        Utilities,
    ];
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                if (name !== "constructor") {
                    const descriptor = {
                        value: baseCtor.prototype[name],
                        enumerable: false,
                        configurable: true,
                        writable: true,
                    };
                    Object.defineProperty(derivedCtor.prototype, name, descriptor);
                }
            });
        });
    }
    function applyStaticMixins(derivedCtor, baseCtors) {
        baseCtors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor).forEach((name) => {
                if (name !== "prototype" && name !== "name" && name !== "length" && name !== "arguments" && name !== "caller") {
                    const descriptor = {
                        value: baseCtor[name],
                        enumerable: false,
                        configurable: true,
                        writable: true,
                    };
                    Object.defineProperty(derivedCtor, name, descriptor);
                }
            });
        });
    }
    applyMixins(J3Object, mixins);
    applyStaticMixins(J3Object, staticMixins);
}
export default J3ObjectMixins;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkludGVyZmFjZS9KM09iamVjdE1peGlucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxRQUFRLE1BQU0sWUFBWTtPQUMxQixlQUFlLE1BQU0saUNBQWlDO09BQ3RELGFBQWEsTUFBTSw0QkFBNEI7T0FDL0MsaUJBQWlCLE1BQU0sa0NBQWtDO09BQ3pELHNCQUFzQixNQUFNLHVDQUF1QztPQUNuRSxTQUFTLE1BQU0sb0JBQW9CO09BQ25DLElBQUksTUFBTSxlQUFlO0FBRWhDO0lBQ0UsTUFBTSxNQUFNLEdBQUc7UUFDYixlQUFlO1FBQ2YsYUFBYTtRQUNiLGlCQUFpQjtRQUNqQixzQkFBc0I7S0FDdkIsQ0FBQztJQUVGLE1BQU0sWUFBWSxHQUFHO1FBQ25CLElBQUk7UUFDSixTQUFTO0tBQ1YsQ0FBQztJQUVGLHFCQUFxQixXQUFnQixFQUFFLFNBQWdCO1FBQ3JELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRO1lBQ3pCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSTtnQkFDMUQsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLE1BQU0sVUFBVSxHQUFHO3dCQUNqQixLQUFLLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7d0JBQy9CLFVBQVUsRUFBRSxLQUFLO3dCQUNqQixZQUFZLEVBQUUsSUFBSTt3QkFDbEIsUUFBUSxFQUFFLElBQUk7cUJBQ2YsQ0FBQztvQkFDRixNQUFNLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUNqRSxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCwyQkFBMkIsV0FBZ0IsRUFBRSxTQUFnQjtRQUMzRCxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUTtZQUN6QixNQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSTtnQkFDaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxLQUFLLFdBQVcsSUFBSSxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDOUcsTUFBTSxVQUFVLEdBQUc7d0JBQ2pCLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDO3dCQUNyQixVQUFVLEVBQUUsS0FBSzt3QkFDakIsWUFBWSxFQUFFLElBQUk7d0JBQ2xCLFFBQVEsRUFBRSxJQUFJO3FCQUNmLENBQUM7b0JBQ0YsTUFBTSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN2RCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRUQsZUFBZSxjQUFjLENBQUMiLCJmaWxlIjoiSW50ZXJmYWNlL0ozT2JqZWN0TWl4aW5zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEozT2JqZWN0IGZyb20gXCIuL0ozT2JqZWN0XCI7XG5pbXBvcnQgR29tbE5vZGVNZXRob2RzIGZyb20gXCIuL01pc2NlbGxhbmVvdXMvR29tbE5vZGVNZXRob2RzXCI7XG5pbXBvcnQgVHJlZVRyYXZlcnNhbCBmcm9tIFwiLi9UcmF2ZXJzaW5nL1RyZWVUcmF2ZXJzYWxcIjtcbmltcG9ydCBHZW5lcmFsQXR0cmlidXRlcyBmcm9tIFwiLi9NYW5pcHVsYXRpb24vR2VuZXJhbEF0dHJpYnV0ZXNcIjtcbmltcG9ydCBDb2xsZWN0aW9uTWFuaXB1bGF0aW9uIGZyb20gXCIuL01hbmlwdWxhdGlvbi9Db2xsZWN0aW9uTWFuaXB1bGF0aW9uXCI7XG5pbXBvcnQgVXRpbGl0aWVzIGZyb20gXCIuL1N0YXRpYy9VdGlsaXRpZXNcIjtcbmltcG9ydCBGaW5kIGZyb20gXCIuL1N0YXRpYy9GaW5kXCI7XG5cbmZ1bmN0aW9uIEozT2JqZWN0TWl4aW5zKCkge1xuICBjb25zdCBtaXhpbnMgPSBbXG4gICAgR29tbE5vZGVNZXRob2RzLFxuICAgIFRyZWVUcmF2ZXJzYWwsXG4gICAgR2VuZXJhbEF0dHJpYnV0ZXMsXG4gICAgQ29sbGVjdGlvbk1hbmlwdWxhdGlvbixcbiAgXTtcblxuICBjb25zdCBzdGF0aWNNaXhpbnMgPSBbXG4gICAgRmluZCxcbiAgICBVdGlsaXRpZXMsXG4gIF07XG5cbiAgZnVuY3Rpb24gYXBwbHlNaXhpbnMoZGVyaXZlZEN0b3I6IGFueSwgYmFzZUN0b3JzOiBhbnlbXSkge1xuICAgIGJhc2VDdG9ycy5mb3JFYWNoKChiYXNlQ3RvcikgPT4ge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZUN0b3IucHJvdG90eXBlKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICAgIGlmIChuYW1lICE9PSBcImNvbnN0cnVjdG9yXCIpIHtcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yID0ge1xuICAgICAgICAgICAgdmFsdWU6IGJhc2VDdG9yLnByb3RvdHlwZVtuYW1lXSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVyaXZlZEN0b3IucHJvdG90eXBlLCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBhcHBseVN0YXRpY01peGlucyhkZXJpdmVkQ3RvcjogYW55LCBiYXNlQ3RvcnM6IGFueVtdKSB7XG4gICAgYmFzZUN0b3JzLmZvckVhY2goKGJhc2VDdG9yKSA9PiB7XG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3RvcikuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICBpZiAobmFtZSAhPT0gXCJwcm90b3R5cGVcIiAmJiBuYW1lICE9PSBcIm5hbWVcIiAmJiBuYW1lICE9PSBcImxlbmd0aFwiICYmIG5hbWUgIT09IFwiYXJndW1lbnRzXCIgJiYgbmFtZSAhPT0gXCJjYWxsZXJcIikge1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSB7XG4gICAgICAgICAgICB2YWx1ZTogYmFzZUN0b3JbbmFtZV0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIH07XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlcml2ZWRDdG9yLCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBhcHBseU1peGlucyhKM09iamVjdCwgbWl4aW5zKTtcbiAgYXBwbHlTdGF0aWNNaXhpbnMoSjNPYmplY3QsIHN0YXRpY01peGlucyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEozT2JqZWN0TWl4aW5zO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
