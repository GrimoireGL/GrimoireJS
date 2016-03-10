import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import Color4 from "../../../Math/Color4";
import JThreeContext from "../../../JThreeContext";
import ContextComponents from "../../../ContextComponents";
import Vector3 from "../../../Math/Vector3";
import Vector2 from "../../../Math/Vector2";
class MaterialNodeBase extends CoreRelatedNodeBase {
    constructor() {
        super();
        this.__groupPrefix = "material";
        this._name = "";
        this.attributes.defineAttribute({
            "name": {
                value: undefined,
                converter: "string",
                onchanged: this._onNameAttrChanged,
            }
        });
    }
    __onMount() {
        super.__onMount();
    }
    /**
     * Construct material. This method must be overridden.
     * @return {Material} [description]
     */
    __setMaterial(material, callbackfn) {
        this.target = material;
        this.target.on("ready", () => {
            this._generateAttributeForPasses();
            this.nodeExport(this._name);
            callbackfn();
        });
    }
    get Material() {
        return this.target;
    }
    __getMaterialFromMatName(name) {
        return JThreeContext.getContextComponent(ContextComponents.MaterialManager).constructMaterial(name);
    }
    _onNameAttrChanged(attr) {
        const name = attr.Value;
        if (typeof name !== "string") {
            throw Error(`${this.getTypeName()}: name attribute must be required.`);
        }
        this._name = name;
        if (this.target && this.target.Initialized) {
            this.nodeExport(this._name);
        }
        attr.done();
    }
    _generateAttributeForPasses() {
        if (this.target["_passes"]) {
            let passes = this.target["_passes"];
            let passVariables = {};
            for (let i = 0; i < passes.length; i++) {
                const pass = passes[i];
                const uniforms = pass.programDescription.uniforms;
                for (let variableName in uniforms) {
                    if (variableName[0] === "_") {
                        continue; // Ignore system variables
                    }
                    if (!passVariables[variableName]) {
                        // When the pass variable are not found yet.
                        passVariables[variableName] = uniforms[variableName];
                    }
                    else {
                        // When the pass variable are already found.
                        if (passVariables[variableName] === uniforms[variableName]) {
                            continue; // When the variable was found and same type.(This is not matter)
                        }
                        else {
                            console.error("Material can not contain same variables even if these variable are included in different passes");
                        }
                    }
                }
            }
            let attributes = {};
            for (let variableName in passVariables) {
                const attribute = this._generateAttributeForVariable(variableName, passVariables[variableName]);
                if (attribute) {
                    attributes[variableName] = attribute;
                }
            }
            this.attributes.defineAttribute(attributes);
        }
    }
    _generateAttributeForVariable(variableName, variableInfo) {
        let converter;
        let initialValue;
        if (variableInfo.variableType === "vec2") {
            converter = "vec2";
            initialValue = Vector2.Zero;
        }
        if (variableInfo.variableType === "vec3") {
            converter = "color3";
            initialValue = Vector3.Zero;
        }
        if (variableInfo.variableType === "vec4") {
            converter = "color4"; // TODO add vector4 converter
            initialValue = new Color4(0, 0, 0, 1);
        }
        if (variableInfo.variableType === "float") {
            converter = "float"; // This should be float
            initialValue = 0.0;
        }
        if (variableInfo.variableType === "sampler2D") {
            return {
                converter: "string",
                value: "",
                onchanged: (attr) => {
                    if (attr.Value) {
                        this.nodeImport("jthree.resource.Texture2D", attr.Value, (node) => {
                            if (node) {
                                this.target.materialVariables[variableName] = node.target;
                                attr.done();
                            }
                            else {
                            }
                        });
                    }
                }
            };
        }
        if (variableInfo.variableType === "samplerCube") {
            return {
                converter: "string",
                value: "",
                onchanged: (attr) => {
                    if (attr.Value) {
                        this.nodeImport("jthree.resource.TextureCube", attr.Value, (node) => {
                            if (node) {
                                this.target.materialVariables[variableName] = node.target;
                                attr.done();
                            }
                            else {
                            }
                        });
                    }
                }
            };
        }
        if (!converter) {
            console.warn(`Variable forwarding for ${variableInfo.variableType} is not implemented yet. Attribute declaration of ${variableInfo.variableName} was skipped.`);
            return undefined;
        }
        return {
            converter: converter,
            value: initialValue,
            onchanged: (attr) => {
                this.target.materialVariables[variableName] = attr.Value;
                attr.done();
            }
        };
    }
}
export default MaterialNodeBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZXMvTWF0ZXJpYWxzL01hdGVyaWFsTm9kZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sbUJBQW1CLE1BQU0sMkJBQTJCO09BQ3BELE1BQU0sTUFBTSxzQkFBc0I7T0FFbEMsYUFBYSxNQUFNLHdCQUF3QjtPQUUzQyxpQkFBaUIsTUFBTSw0QkFBNEI7T0FHbkQsT0FBTyxNQUFNLHVCQUF1QjtPQUNwQyxPQUFPLE1BQU0sdUJBQXVCO0FBUTNDLCtCQUFtRCxtQkFBbUI7SUFLcEU7UUFDRSxPQUFPLENBQUM7UUFMQSxrQkFBYSxHQUFXLFVBQVUsQ0FBQztRQUVyQyxVQUFLLEdBQVcsRUFBRSxDQUFDO1FBSXpCLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO1lBQzlCLE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUUsU0FBUztnQkFDaEIsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsa0JBQWtCO2FBQ25DO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVTLFNBQVM7UUFDakIsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7O09BR0c7SUFDTyxhQUFhLENBQUMsUUFBVyxFQUFFLFVBQXNCO1FBQ3pELElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtZQUN0QixJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztZQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QixVQUFVLEVBQUUsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQWMsUUFBUTtRQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRVMsd0JBQXdCLENBQUMsSUFBWTtRQUM3QyxNQUFNLENBQUMsYUFB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QUMsQ0FBQztZQUNoSyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFDRCxNQUFNLENBQUM7WUFDTCxTQUFTLEVBQUUsU0FBUztZQUNwQixLQUFLLEVBQUUsWUFBWTtZQUNuQixTQUFTLEVBQUUsQ0FBQyxJQUFJO2dCQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDekQsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsQ0FBQztTQUNGLENBQUM7SUFDSixDQUFDO0FBQ0gsQ0FBQztBQUVELGVBQWUsZ0JBQWdCLENBQUMiLCJmaWxlIjoiR29tbC9Ob2Rlcy9NYXRlcmlhbHMvTWF0ZXJpYWxOb2RlQmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb3JlUmVsYXRlZE5vZGVCYXNlIGZyb20gXCIuLi8uLi9Db3JlUmVsYXRlZE5vZGVCYXNlXCI7XG5pbXBvcnQgQ29sb3I0IGZyb20gXCIuLi8uLi8uLi9NYXRoL0NvbG9yNFwiO1xuaW1wb3J0IE1hdGVyaWFsTWFuYWdlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9NYXRlcmlhbHMvQmFzZS9NYXRlcmlhbE1hbmFnZXJcIjtcbmltcG9ydCBKVGhyZWVDb250ZXh0IGZyb20gXCIuLi8uLi8uLi9KVGhyZWVDb250ZXh0XCI7XG5pbXBvcnQgQmFzaWNNYXRlcmlhbCBmcm9tIFwiLi4vLi4vLi4vQ29yZS9NYXRlcmlhbHMvQmFzZS9CYXNpY01hdGVyaWFsXCI7XG5pbXBvcnQgQ29udGV4dENvbXBvbmVudHMgZnJvbSBcIi4uLy4uLy4uL0NvbnRleHRDb21wb25lbnRzXCI7XG5pbXBvcnQgSVZhcmlhYmxlRGVzY3JpcHRpb24gZnJvbSBcIi4uLy4uLy4uL0NvcmUvTWF0ZXJpYWxzL0Jhc2UvSVZhcmlhYmxlRGVzY3JpcHRpb25cIjtcbmltcG9ydCBBdHRyaWJ1dGVEZWNsYXRpb25Cb2R5IGZyb20gXCIuLi8uLi9BdHRyaWJ1dGVEZWNsYXRpb25Cb2R5XCI7XG5pbXBvcnQgVmVjdG9yMyBmcm9tIFwiLi4vLi4vLi4vTWF0aC9WZWN0b3IzXCI7XG5pbXBvcnQgVmVjdG9yMiBmcm9tIFwiLi4vLi4vLi4vTWF0aC9WZWN0b3IyXCI7XG5pbXBvcnQgQXR0cmlidXRlRGVjbGFyYXRpb24gZnJvbSBcIi4uLy4uL0F0dHJpYnV0ZURlY2xhcmF0aW9uXCI7XG5pbXBvcnQgTWF0ZXJpYWwgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTWF0ZXJpYWxzL01hdGVyaWFsXCI7XG5pbXBvcnQgTWF0ZXJpYWxQYXNzIGZyb20gXCIuLi8uLi8uLi9Db3JlL01hdGVyaWFscy9CYXNlL01hdGVyaWFsUGFzc1wiO1xuaW1wb3J0IEdvbWxBdHRyaWJ1dGUgZnJvbSBcIi4uLy4uL0dvbWxBdHRyaWJ1dGVcIjtcbmltcG9ydCBUZXh0dXJlTm9kZSBmcm9tIFwiLi4vLi4vTm9kZXMvVGV4dHVyZS9UZXh0dXJlTm9kZVwiO1xuaW1wb3J0IEN1YmVUZXh0dXJlTm9kZSBmcm9tIFwiLi4vLi4vTm9kZXMvVGV4dHVyZS9DdWJlVGV4dHVyZU5vZGVcIjtcblxuY2xhc3MgTWF0ZXJpYWxOb2RlQmFzZTxUIGV4dGVuZHMgTWF0ZXJpYWw+IGV4dGVuZHMgQ29yZVJlbGF0ZWROb2RlQmFzZTxUPiB7XG4gIHByb3RlY3RlZCBfX2dyb3VwUHJlZml4OiBzdHJpbmcgPSBcIm1hdGVyaWFsXCI7XG5cbiAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nID0gXCJcIjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuYXR0cmlidXRlcy5kZWZpbmVBdHRyaWJ1dGUoe1xuICAgICAgXCJuYW1lXCI6IHtcbiAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgY29udmVydGVyOiBcInN0cmluZ1wiLFxuICAgICAgICBvbmNoYW5nZWQ6IHRoaXMuX29uTmFtZUF0dHJDaGFuZ2VkLFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9fb25Nb3VudCgpOiB2b2lkIHtcbiAgICBzdXBlci5fX29uTW91bnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgbWF0ZXJpYWwuIFRoaXMgbWV0aG9kIG11c3QgYmUgb3ZlcnJpZGRlbi5cbiAgICogQHJldHVybiB7TWF0ZXJpYWx9IFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHByb3RlY3RlZCBfX3NldE1hdGVyaWFsKG1hdGVyaWFsOiBULCBjYWxsYmFja2ZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy50YXJnZXQgPSBtYXRlcmlhbDtcbiAgICB0aGlzLnRhcmdldC5vbihcInJlYWR5XCIsICgpID0+IHtcbiAgICAgIHRoaXMuX2dlbmVyYXRlQXR0cmlidXRlRm9yUGFzc2VzKCk7XG4gICAgICB0aGlzLm5vZGVFeHBvcnQodGhpcy5fbmFtZSk7XG4gICAgICBjYWxsYmFja2ZuKCk7XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IE1hdGVyaWFsKCk6IFQge1xuICAgIHJldHVybiB0aGlzLnRhcmdldDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfX2dldE1hdGVyaWFsRnJvbU1hdE5hbWUobmFtZTogc3RyaW5nKTogQmFzaWNNYXRlcmlhbCB7XG4gICAgcmV0dXJuIEpUaHJlZUNvbnRleHQuZ2V0Q29udGV4dENvbXBvbmVudDxNYXRlcmlhbE1hbmFnZXI+KENvbnRleHRDb21wb25lbnRzLk1hdGVyaWFsTWFuYWdlcikuY29uc3RydWN0TWF0ZXJpYWwobmFtZSk7XG4gIH1cblxuICBwcml2YXRlIF9vbk5hbWVBdHRyQ2hhbmdlZChhdHRyOiBHb21sQXR0cmlidXRlKTogdm9pZCB7XG4gICAgY29uc3QgbmFtZSA9IGF0dHIuVmFsdWU7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICB0aHJvdyBFcnJvcihgJHt0aGlzLmdldFR5cGVOYW1lKCl9OiBuYW1lIGF0dHJpYnV0ZSBtdXN0IGJlIHJlcXVpcmVkLmApO1xuICAgIH1cbiAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgICBpZiAodGhpcy50YXJnZXQgJiYgdGhpcy50YXJnZXQuSW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMubm9kZUV4cG9ydCh0aGlzLl9uYW1lKTtcbiAgICB9XG4gICAgYXR0ci5kb25lKCk7XG4gIH1cblxuICBwcml2YXRlIF9nZW5lcmF0ZUF0dHJpYnV0ZUZvclBhc3NlcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50YXJnZXRbXCJfcGFzc2VzXCJdKSB7XG4gICAgICBsZXQgcGFzc2VzID0gPE1hdGVyaWFsUGFzc1tdPnRoaXMudGFyZ2V0W1wiX3Bhc3Nlc1wiXTtcbiAgICAgIGxldCBwYXNzVmFyaWFibGVzID0ge307XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBwYXNzID0gcGFzc2VzW2ldO1xuICAgICAgICBjb25zdCB1bmlmb3JtcyA9IHBhc3MucHJvZ3JhbURlc2NyaXB0aW9uLnVuaWZvcm1zO1xuICAgICAgICBmb3IgKGxldCB2YXJpYWJsZU5hbWUgaW4gdW5pZm9ybXMpIHtcbiAgICAgICAgICBpZiAodmFyaWFibGVOYW1lWzBdID09PSBcIl9cIikge1xuICAgICAgICAgICAgY29udGludWU7IC8vIElnbm9yZSBzeXN0ZW0gdmFyaWFibGVzXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghcGFzc1ZhcmlhYmxlc1t2YXJpYWJsZU5hbWVdKSB7XG4gICAgICAgICAgICAvLyBXaGVuIHRoZSBwYXNzIHZhcmlhYmxlIGFyZSBub3QgZm91bmQgeWV0LlxuICAgICAgICAgICAgcGFzc1ZhcmlhYmxlc1t2YXJpYWJsZU5hbWVdID0gdW5pZm9ybXNbdmFyaWFibGVOYW1lXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2hlbiB0aGUgcGFzcyB2YXJpYWJsZSBhcmUgYWxyZWFkeSBmb3VuZC5cbiAgICAgICAgICAgIGlmIChwYXNzVmFyaWFibGVzW3ZhcmlhYmxlTmFtZV0gPT09IHVuaWZvcm1zW3ZhcmlhYmxlTmFtZV0pIHtcbiAgICAgICAgICAgICAgY29udGludWU7IC8vIFdoZW4gdGhlIHZhcmlhYmxlIHdhcyBmb3VuZCBhbmQgc2FtZSB0eXBlLihUaGlzIGlzIG5vdCBtYXR0ZXIpXG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBXaGVuIHRoZSB2YXJpYWJsZSB3YXMgYWxyZWFkeSBmb3VuZCBhbmRcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk1hdGVyaWFsIGNhbiBub3QgY29udGFpbiBzYW1lIHZhcmlhYmxlcyBldmVuIGlmIHRoZXNlIHZhcmlhYmxlIGFyZSBpbmNsdWRlZCBpbiBkaWZmZXJlbnQgcGFzc2VzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IGF0dHJpYnV0ZXM6IEF0dHJpYnV0ZURlY2xhcmF0aW9uID0ge307XG4gICAgICBmb3IgKGxldCB2YXJpYWJsZU5hbWUgaW4gcGFzc1ZhcmlhYmxlcykge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSB0aGlzLl9nZW5lcmF0ZUF0dHJpYnV0ZUZvclZhcmlhYmxlKHZhcmlhYmxlTmFtZSwgcGFzc1ZhcmlhYmxlc1t2YXJpYWJsZU5hbWVdKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZSkge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbdmFyaWFibGVOYW1lXSA9IGF0dHJpYnV0ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5hdHRyaWJ1dGVzLmRlZmluZUF0dHJpYnV0ZShhdHRyaWJ1dGVzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZW5lcmF0ZUF0dHJpYnV0ZUZvclZhcmlhYmxlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCB2YXJpYWJsZUluZm86IElWYXJpYWJsZURlc2NyaXB0aW9uKTogQXR0cmlidXRlRGVjbGF0aW9uQm9keSB7XG4gICAgbGV0IGNvbnZlcnRlcjtcbiAgICBsZXQgaW5pdGlhbFZhbHVlO1xuICAgIGlmICh2YXJpYWJsZUluZm8udmFyaWFibGVUeXBlID09PSBcInZlYzJcIikgeyAvLyBUT0RPIGNvbnZlcnRlciBuYW1lIHNob3VsZCBiZSB2ZWMyLHZlYzMgb3IgdmVjNCwgc2FtZSBhcyBuYW1lIG9mIHZlY3RvciB2YXJpYWJsZSBpbiBHTFNMLlxuICAgICAgY29udmVydGVyID0gXCJ2ZWMyXCI7XG4gICAgICBpbml0aWFsVmFsdWUgPSBWZWN0b3IyLlplcm87XG4gICAgfVxuICAgIGlmICh2YXJpYWJsZUluZm8udmFyaWFibGVUeXBlID09PSBcInZlYzNcIikge1xuICAgICAgY29udmVydGVyID0gXCJjb2xvcjNcIjtcbiAgICAgIGluaXRpYWxWYWx1ZSA9IFZlY3RvcjMuWmVybztcbiAgICB9XG4gICAgaWYgKHZhcmlhYmxlSW5mby52YXJpYWJsZVR5cGUgPT09IFwidmVjNFwiKSB7XG4gICAgICBjb252ZXJ0ZXIgPSBcImNvbG9yNFwiOyAvLyBUT0RPIGFkZCB2ZWN0b3I0IGNvbnZlcnRlclxuICAgICAgaW5pdGlhbFZhbHVlID0gbmV3IENvbG9yNCgwLCAwLCAwLCAxKTtcbiAgICB9XG4gICAgaWYgKHZhcmlhYmxlSW5mby52YXJpYWJsZVR5cGUgPT09IFwiZmxvYXRcIikge1xuICAgICAgY29udmVydGVyID0gXCJmbG9hdFwiOyAvLyBUaGlzIHNob3VsZCBiZSBmbG9hdFxuICAgICAgaW5pdGlhbFZhbHVlID0gMC4wO1xuICAgIH1cbiAgICBpZiAodmFyaWFibGVJbmZvLnZhcmlhYmxlVHlwZSA9PT0gXCJzYW1wbGVyMkRcIikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29udmVydGVyOiBcInN0cmluZ1wiLFxuICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgb25jaGFuZ2VkOiAoYXR0cikgPT4ge1xuICAgICAgICAgIGlmIChhdHRyLlZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGVJbXBvcnQoXCJqdGhyZWUucmVzb3VyY2UuVGV4dHVyZTJEXCIsIGF0dHIuVmFsdWUsIChub2RlOiBUZXh0dXJlTm9kZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0Lm1hdGVyaWFsVmFyaWFibGVzW3ZhcmlhYmxlTmFtZV0gPSBub2RlLnRhcmdldDtcbiAgICAgICAgICAgICAgICBhdHRyLmRvbmUoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB3aGVuIHRleHR1cmUgbm9kZSByZW1vdmVkXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHZhcmlhYmxlSW5mby52YXJpYWJsZVR5cGUgPT09IFwic2FtcGxlckN1YmVcIikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29udmVydGVyOiBcInN0cmluZ1wiLFxuICAgICAgICB2YWx1ZTogXCJcIixcbiAgICAgICAgb25jaGFuZ2VkOiAoYXR0cikgPT4ge1xuICAgICAgICAgIGlmIChhdHRyLlZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGVJbXBvcnQoXCJqdGhyZWUucmVzb3VyY2UuVGV4dHVyZUN1YmVcIiwgYXR0ci5WYWx1ZSwgKG5vZGU6IEN1YmVUZXh0dXJlTm9kZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0Lm1hdGVyaWFsVmFyaWFibGVzW3ZhcmlhYmxlTmFtZV0gPSBub2RlLnRhcmdldDtcbiAgICAgICAgICAgICAgICBhdHRyLmRvbmUoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB3aGVuIHRleHR1cmUgbm9kZSByZW1vdmVkXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKCFjb252ZXJ0ZXIpIHtcbiAgICAgIGNvbnNvbGUud2FybihgVmFyaWFibGUgZm9yd2FyZGluZyBmb3IgJHt2YXJpYWJsZUluZm8udmFyaWFibGVUeXBlfSBpcyBub3QgaW1wbGVtZW50ZWQgeWV0LiBBdHRyaWJ1dGUgZGVjbGFyYXRpb24gb2YgJHt2YXJpYWJsZUluZm8udmFyaWFibGVOYW1lfSB3YXMgc2tpcHBlZC5gKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBjb252ZXJ0ZXI6IGNvbnZlcnRlcixcbiAgICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXG4gICAgICBvbmNoYW5nZWQ6IChhdHRyKSA9PiB7XG4gICAgICAgIHRoaXMudGFyZ2V0Lm1hdGVyaWFsVmFyaWFibGVzW3ZhcmlhYmxlTmFtZV0gPSBhdHRyLlZhbHVlO1xuICAgICAgICBhdHRyLmRvbmUoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hdGVyaWFsTm9kZUJhc2U7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
