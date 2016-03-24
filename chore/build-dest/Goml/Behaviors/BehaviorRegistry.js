import JThreeObject from "../../Base/JThreeObject";
/**
* Provides feature to register behavior.
*/
class BehaviorRegistry extends JThreeObject {
    constructor() {
        super();
        this._behaviorInstances = {};
    }
    defineBehavior(nameOrDeclarations, behaviorDeclaration) {
        if (typeof nameOrDeclarations === "string") {
            const behaviorName = nameOrDeclarations;
            this._behaviorInstances[behaviorName] = this._generateBehaviorInstance(behaviorDeclaration);
        }
        else {
            // assume arguments are object.
            const behaviorDeclarations = nameOrDeclarations;
            for (let behaviorKey in behaviorDeclarations) {
                this._behaviorInstances[behaviorKey] = this._generateBehaviorInstance(behaviorDeclarations[behaviorKey]);
            }
        }
    }
    getBehavior(behaviorName) {
        return this._behaviorInstances[behaviorName];
    }
    _generateBehaviorInstance(behaviorDecl) {
        if (typeof behaviorDecl === "function") {
            // Assume generation seed is constructor of behavior
            return (new behaviorDecl());
        }
        else {
            return this._copyObject(behaviorDecl);
        }
    }
    /**
     * Generate reference copy
     * @param targetObject the object you want to copy
     * @returns {}
     */
    _copyObject(targetObject) {
        if (typeof targetObject === "object") {
            const newObject = {};
            for (let key in targetObject) {
                if (targetObject.hasOwnProperty(key)) {
                    const property = targetObject[key];
                    newObject[key] = this._copyObject(property);
                }
            }
            return newObject;
        }
        else {
            return targetObject;
        }
    }
}
export default BehaviorRegistry;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvQmVoYXZpb3JzL0JlaGF2aW9yUmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sWUFBWSxNQUFNLHlCQUF5QjtBQUlsRDs7RUFFRTtBQUNGLCtCQUErQixZQUFZO0lBQ3pDO1FBQ0UsT0FBTyxDQUFDO1FBR0YsdUJBQWtCLEdBQThDLEVBQUUsQ0FBQztJQUYzRSxDQUFDO0lBTU0sY0FBYyxDQUFDLGtCQUFnRCxFQUFFLG1CQUF1RDtRQUM3SCxFQUFFLENBQUMsQ0FBQyxPQUFPLGtCQUFrQixLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDM0MsTUFBTSxZQUFZLEdBQVcsa0JBQWtCLENBQUM7WUFDaEQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzlGLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLCtCQUErQjtZQUMvQixNQUFNLG9CQUFvQixHQUF3QixrQkFBa0IsQ0FBQztZQUNyRSxHQUFHLENBQUMsQ0FBQyxJQUFJLFdBQVcsSUFBSSxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMzRyxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFTSxXQUFXLENBQUMsWUFBb0I7UUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU8seUJBQXlCLENBQUMsWUFBK0M7UUFDL0UsRUFBRSxDQUFDLENBQUMsT0FBTyxZQUFZLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN2QyxvREFBb0Q7WUFDcEQsTUFBTSxDQUEwQixDQUFDLElBQWMsWUFBYSxFQUFFLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4QyxDQUFDO0lBQ0gsQ0FBQztJQUNEOzs7O09BSUc7SUFDSyxXQUFXLENBQUMsWUFBaUI7UUFDbkMsRUFBRSxDQUFDLENBQUMsT0FBTyxZQUFZLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JDLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDbkMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzlDLENBQUM7WUFDSCxDQUFDO1lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNuQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ3RCLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVELGVBQWUsZ0JBQWdCLENBQUMiLCJmaWxlIjoiR29tbC9CZWhhdmlvcnMvQmVoYXZpb3JSZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBKVGhyZWVPYmplY3QgZnJvbSBcIi4uLy4uL0Jhc2UvSlRocmVlT2JqZWN0XCI7XG5pbXBvcnQgQmVoYXZpb3JEZWNsYXJhdGlvbiBmcm9tIFwiLi9CZWhhdmlvckRlY2xhcmF0aW9uXCI7XG5pbXBvcnQgQmVoYXZpb3JEZWNsYXJhdGlvbkJvZHkgZnJvbSBcIi4vQmVoYXZpb3JEZWNsYXJhdGlvbkJvZHlcIjtcbmltcG9ydCB7QWN0aW9uMH0gZnJvbSBcIi4uLy4uL0Jhc2UvRGVsZWdhdGVzXCI7XG4vKipcbiogUHJvdmlkZXMgZmVhdHVyZSB0byByZWdpc3RlciBiZWhhdmlvci5cbiovXG5jbGFzcyBCZWhhdmlvclJlZ2lzdHJ5IGV4dGVuZHMgSlRocmVlT2JqZWN0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2JlaGF2aW9ySW5zdGFuY2VzOiB7IFtpZDogc3RyaW5nXTogQmVoYXZpb3JEZWNsYXJhdGlvbkJvZHkgfSA9IHt9O1xuXG4gIHB1YmxpYyBkZWZpbmVCZWhhdmlvcihiZWhhdmlvck5hbWU6IHN0cmluZywgYmVoYXZpb3JEZWNsYXJhdGlvbjogQmVoYXZpb3JEZWNsYXJhdGlvbkJvZHkgfCBBY3Rpb24wKTogdm9pZDtcbiAgcHVibGljIGRlZmluZUJlaGF2aW9yKGJlaGF2aW9yRGVjbGFyYXRpb25zOiBCZWhhdmlvckRlY2xhcmF0aW9uKTogdm9pZDtcbiAgcHVibGljIGRlZmluZUJlaGF2aW9yKG5hbWVPckRlY2xhcmF0aW9uczogc3RyaW5nIHwgQmVoYXZpb3JEZWNsYXJhdGlvbiwgYmVoYXZpb3JEZWNsYXJhdGlvbj86IEJlaGF2aW9yRGVjbGFyYXRpb25Cb2R5IHwgQWN0aW9uMCk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgbmFtZU9yRGVjbGFyYXRpb25zID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBjb25zdCBiZWhhdmlvck5hbWUgPSA8c3RyaW5nPm5hbWVPckRlY2xhcmF0aW9ucztcbiAgICAgIHRoaXMuX2JlaGF2aW9ySW5zdGFuY2VzW2JlaGF2aW9yTmFtZV0gPSB0aGlzLl9nZW5lcmF0ZUJlaGF2aW9ySW5zdGFuY2UoYmVoYXZpb3JEZWNsYXJhdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGFzc3VtZSBhcmd1bWVudHMgYXJlIG9iamVjdC5cbiAgICAgIGNvbnN0IGJlaGF2aW9yRGVjbGFyYXRpb25zID0gPEJlaGF2aW9yRGVjbGFyYXRpb24+bmFtZU9yRGVjbGFyYXRpb25zO1xuICAgICAgZm9yIChsZXQgYmVoYXZpb3JLZXkgaW4gYmVoYXZpb3JEZWNsYXJhdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fYmVoYXZpb3JJbnN0YW5jZXNbYmVoYXZpb3JLZXldID0gdGhpcy5fZ2VuZXJhdGVCZWhhdmlvckluc3RhbmNlKGJlaGF2aW9yRGVjbGFyYXRpb25zW2JlaGF2aW9yS2V5XSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldEJlaGF2aW9yKGJlaGF2aW9yTmFtZTogc3RyaW5nKTogQmVoYXZpb3JEZWNsYXJhdGlvbkJvZHkge1xuICAgIHJldHVybiB0aGlzLl9iZWhhdmlvckluc3RhbmNlc1tiZWhhdmlvck5hbWVdO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2VuZXJhdGVCZWhhdmlvckluc3RhbmNlKGJlaGF2aW9yRGVjbDogQmVoYXZpb3JEZWNsYXJhdGlvbkJvZHkgfCBBY3Rpb24wKTogQmVoYXZpb3JEZWNsYXJhdGlvbkJvZHkge1xuICAgIGlmICh0eXBlb2YgYmVoYXZpb3JEZWNsID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIC8vIEFzc3VtZSBnZW5lcmF0aW9uIHNlZWQgaXMgY29uc3RydWN0b3Igb2YgYmVoYXZpb3JcbiAgICAgIHJldHVybiA8QmVoYXZpb3JEZWNsYXJhdGlvbkJvZHk+KG5ldyAoPEFjdGlvbjA+YmVoYXZpb3JEZWNsKSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX2NvcHlPYmplY3QoYmVoYXZpb3JEZWNsKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHJlZmVyZW5jZSBjb3B5XG4gICAqIEBwYXJhbSB0YXJnZXRPYmplY3QgdGhlIG9iamVjdCB5b3Ugd2FudCB0byBjb3B5XG4gICAqIEByZXR1cm5zIHt9XG4gICAqL1xuICBwcml2YXRlIF9jb3B5T2JqZWN0KHRhcmdldE9iamVjdDogYW55KToge30ge1xuICAgIGlmICh0eXBlb2YgdGFyZ2V0T2JqZWN0ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBjb25zdCBuZXdPYmplY3QgPSB7fTtcbiAgICAgIGZvciAobGV0IGtleSBpbiB0YXJnZXRPYmplY3QpIHtcbiAgICAgICAgaWYgKHRhcmdldE9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydHkgPSB0YXJnZXRPYmplY3Rba2V5XTtcbiAgICAgICAgICBuZXdPYmplY3Rba2V5XSA9IHRoaXMuX2NvcHlPYmplY3QocHJvcGVydHkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3T2JqZWN0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGFyZ2V0T2JqZWN0O1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCZWhhdmlvclJlZ2lzdHJ5O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
