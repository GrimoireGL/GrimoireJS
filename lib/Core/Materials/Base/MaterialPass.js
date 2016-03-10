import DefaultValuePreProcessor from "./DefaultValuePreProcessor";
import JThreeObjectWithID from "../../../Base/JThreeObjectWithID";
import XMLRenderConfigUtility from "./XMLRenderConfigUtility";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
import ShaderParser from "./ShaderParser";
import Q from "q";
class MaterialPass extends JThreeObjectWithID {
    constructor(material, passDocument, materialName, index) {
        super();
        this.ready = false;
        this._renderConfigureCache = {};
        this.passIndex = index;
        this._material = material;
        this._passDocument = passDocument;
        this.materialName = materialName;
    }
    initialize(uniformRegisters) {
        const shaderCode = this._passDocument.getElementsByTagName("glsl").item(0).textContent;
        return ShaderParser.parseCombined(shaderCode).then((result) => {
            this.programDescription = result;
            DefaultValuePreProcessor.preprocess(this.programDescription.uniforms);
            this._constructProgram(this.materialName + this.passIndex);
            return Q.all(uniformRegisters.map(m => m.preprocess(this, this.programDescription.uniforms)));
        }).then(() => {
            this.ready = true;
        });
    }
    apply(matArg, uniformRegisters, material) {
        if (!this.ready) {
            throw new Error("initialization was not completed yet!");
        }
        const gl = matArg.renderStage.GL;
        const pWrapper = this.program.getForContext(matArg.renderStage.Renderer.Canvas);
        const renderConfig = this._fetchRenderConfigure(matArg);
        XMLRenderConfigUtility.applyAll(gl, renderConfig);
        // Declare using program before assigning material variables
        pWrapper.useProgram();
        // Apply attribute variables by geometries
        matArg.object.Geometry.applyAttributeVariables(pWrapper, this.programDescription.attributes);
        // Apply uniform variables
        uniformRegisters.forEach((r) => {
            r.register(gl, pWrapper, matArg, this.programDescription.uniforms);
        });
        material.registerMaterialVariables(matArg.renderStage.Renderer, pWrapper, this.programDescription.uniforms);
    }
    __preprocessUniformVariables() {
        // Preprocess default value for uniforms
    }
    _fetchRenderConfigure(matArg) {
        const id = matArg.renderStage.ID;
        let result;
        if (this._renderConfigureCache[id]) {
            result = this._renderConfigureCache[id];
        }
        else {
            const configure = XMLRenderConfigUtility.parseRenderConfig(this._passDocument, matArg.renderStage.getDefaultRendererConfigure(matArg.techniqueIndex));
            this._renderConfigureCache[id] = configure;
            result = configure;
        }
        this._material.emit("configure", {
            pass: this,
            passIndex: this.passIndex,
            material: this._material,
            configure: result
        });
        return result;
    }
    _constructProgram(idPrefix) {
        this._passId = idPrefix;
        this.fragmentShader = MaterialPass._resourceManager.createShader(idPrefix + "-fs", this.programDescription.fragment, WebGLRenderingContext.FRAGMENT_SHADER);
        this.vertexShader = MaterialPass._resourceManager.createShader(idPrefix + "-vs", this.programDescription.vertex, WebGLRenderingContext.VERTEX_SHADER);
        this.fragmentShader.loadAll();
        this.vertexShader.loadAll();
        this.program = MaterialPass._resourceManager.createProgram(idPrefix + "-program", [this.vertexShader, this.fragmentShader]);
    }
    static get _resourceManager() {
        return JThreeContext.getContextComponent(ContextComponents.ResourceManager);
    }
}
export default MaterialPass;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvTWF0ZXJpYWxzL0Jhc2UvTWF0ZXJpYWxQYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUNPLHdCQUF3QixNQUFNLDRCQUE0QjtPQUUxRCxrQkFBa0IsTUFBTSxrQ0FBa0M7T0FLMUQsc0JBQXNCLE1BQU0sMEJBQTBCO09BR3RELGlCQUFpQixNQUFNLDRCQUE0QjtPQUNuRCxhQUFhLE1BQU0sd0JBQXdCO09BRTNDLFlBQVksTUFBTSxnQkFBZ0I7T0FDbEMsQ0FBQyxNQUFNLEdBQUc7QUFDakIsMkJBQTJCLGtCQUFrQjtJQXdCM0MsWUFBWSxRQUFrQixFQUFFLFlBQXFCLEVBQUUsWUFBb0IsRUFBRSxLQUFhO1FBQ3hGLE9BQU8sQ0FBQztRQXZCSCxVQUFLLEdBQVksS0FBSyxDQUFDO1FBZ0J0QiwwQkFBcUIsR0FBa0QsRUFBRSxDQUFDO1FBUWhGLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0lBQ25DLENBQUM7SUFFTSxVQUFVLENBQUMsZ0JBQW1DO1FBQ25ELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUN2RixNQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNO1lBQ3hELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLENBQUM7WUFDakMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJ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QixDQUFDO0lBR08saUJBQWlCLENBQUMsUUFBZ0I7UUFDeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7UUFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxLQUFLLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM1SixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLEtBQUssRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3RKLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsUUFBUSxHQUFHLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDOUgsQ0FBQztJQUlELFdBQW1CLGdCQUFnQjtRQUNqQyxNQUFNLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFrQixpQkFBaUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMvRixDQUFDO0FBQ0gsQ0FBQztBQUVELGVBQWUsWUFBWSxDQUFDIiwiZmlsZSI6IkNvcmUvTWF0ZXJpYWxzL0Jhc2UvTWF0ZXJpYWxQYXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2ljUmVnaXN0ZXJlciBmcm9tIFwiLi9SZWdpc3RlcmVyL0Jhc2ljUmVnaXN0ZXJlclwiO1xuaW1wb3J0IERlZmF1bHRWYWx1ZVByZVByb2Nlc3NvciBmcm9tIFwiLi9EZWZhdWx0VmFsdWVQcmVQcm9jZXNzb3JcIjtcbmltcG9ydCBJQ29uZmlndXJlRXZlbnRBcmdzIGZyb20gXCIuLi8uLi9JQ29uZmlndXJlRXZlbnRBcmdzXCI7XG5pbXBvcnQgSlRocmVlT2JqZWN0V2l0aElEIGZyb20gXCIuLi8uLi8uLi9CYXNlL0pUaHJlZU9iamVjdFdpdGhJRFwiO1xuaW1wb3J0IElSZW5kZXJTdGFnZVJlbmRlckNvbmZpZ3VyZSBmcm9tIFwiLi4vLi4vUmVuZGVyZXJzL1JlbmRlclN0YWdlcy9JUmVuZGVyU3RhZ2VSZW5kZXJlckNvbmZpZ3VyZVwiO1xuaW1wb3J0IE1hdGVyaWFsIGZyb20gXCIuLi9NYXRlcmlhbFwiO1xuaW1wb3J0IElQcm9ncmFtRGVzY3JpcHRpb24gZnJvbSBcIi4vSVByb2dyYW1EZXNjcmlwdGlvblwiO1xuaW1wb3J0IElBcHBseU1hdGVyaWFsQXJndW1lbnQgZnJvbSBcIi4vSUFwcGx5TWF0ZXJpYWxBcmd1bWVudFwiO1xuaW1wb3J0IFhNTFJlbmRlckNvbmZpZ1V0aWxpdHkgZnJvbSBcIi4vWE1MUmVuZGVyQ29uZmlnVXRpbGl0eVwiO1xuaW1wb3J0IFByb2dyYW0gZnJvbSBcIi4uLy4uL1Jlc291cmNlcy9Qcm9ncmFtL1Byb2dyYW1cIjtcbmltcG9ydCBTaGFkZXIgZnJvbSBcIi4uLy4uL1Jlc291cmNlcy9TaGFkZXIvU2hhZGVyXCI7XG5pbXBvcnQgQ29udGV4dENvbXBvbmVudHMgZnJvbSBcIi4uLy4uLy4uL0NvbnRleHRDb21wb25lbnRzXCI7XG5pbXBvcnQgSlRocmVlQ29udGV4dCBmcm9tIFwiLi4vLi4vLi4vSlRocmVlQ29udGV4dFwiO1xuaW1wb3J0IFJlc291cmNlTWFuYWdlciBmcm9tIFwiLi4vLi4vUmVzb3VyY2VNYW5hZ2VyXCI7XG5pbXBvcnQgU2hhZGVyUGFyc2VyIGZyb20gXCIuL1NoYWRlclBhcnNlclwiO1xuaW1wb3J0IFEgZnJvbSBcInFcIjtcbmNsYXNzIE1hdGVyaWFsUGFzcyBleHRlbmRzIEpUaHJlZU9iamVjdFdpdGhJRCB7XG5cbiAgcHVibGljIHJlYWR5OiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHVibGljIG1hdGVyaWFsTmFtZTogc3RyaW5nO1xuXG4gIHB1YmxpYyBwYXNzSW5kZXg6IG51bWJlcjtcblxuICBwdWJsaWMgZnJhZ21lbnRTaGFkZXI6IFNoYWRlcjtcblxuICBwdWJsaWMgdmVydGV4U2hhZGVyOiBTaGFkZXI7XG5cbiAgcHVibGljIHByb2dyYW06IFByb2dyYW07XG5cbiAgcHVibGljIHByb2dyYW1EZXNjcmlwdGlvbjogSVByb2dyYW1EZXNjcmlwdGlvbjtcblxuICBwcml2YXRlIF9wYXNzRG9jdW1lbnQ6IEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBfcmVuZGVyQ29uZmlndXJlQ2FjaGU6IHsgW2lkOiBzdHJpbmddOiBJUmVuZGVyU3RhZ2VSZW5kZXJDb25maWd1cmUgfSA9IHt9O1xuXG4gIHByaXZhdGUgX3Bhc3NJZDogc3RyaW5nO1xuXG4gIHByaXZhdGUgX21hdGVyaWFsOiBNYXRlcmlhbDtcblxuICBjb25zdHJ1Y3RvcihtYXRlcmlhbDogTWF0ZXJpYWwsIHBhc3NEb2N1bWVudDogRWxlbWVudCwgbWF0ZXJpYWxOYW1lOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucGFzc0luZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5fbWF0ZXJpYWwgPSBtYXRlcmlhbDtcbiAgICB0aGlzLl9wYXNzRG9jdW1lbnQgPSBwYXNzRG9jdW1lbnQ7XG4gICAgdGhpcy5tYXRlcmlhbE5hbWUgPSBtYXRlcmlhbE5hbWU7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZSh1bmlmb3JtUmVnaXN0ZXJzOiBCYXNpY1JlZ2lzdGVyZXJbXSk6IFEuSVByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHNoYWRlckNvZGUgPSB0aGlzLl9wYXNzRG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJnbHNsXCIpLml0ZW0oMCkudGV4dENvbnRlbnQ7XG4gICAgcmV0dXJuIFNoYWRlclBhcnNlci5wYXJzZUNvbWJpbmVkKHNoYWRlckNvZGUpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgdGhpcy5wcm9ncmFtRGVzY3JpcHRpb24gPSByZXN1bHQ7XG4gICAgICBEZWZhdWx0VmFsdWVQcmVQcm9jZXNzb3IucHJlcHJvY2Vzcyh0aGlzLnByb2dyYW1EZXNjcmlwdGlvbi51bmlmb3Jtcyk7XG4gICAgICB0aGlzLl9jb25zdHJ1Y3RQcm9ncmFtKHRoaXMubWF0ZXJpYWxOYW1lICsgdGhpcy5wYXNzSW5kZXgpO1xuICAgICAgcmV0dXJuIFEuYWxsKHVuaWZvcm1SZWdpc3RlcnMubWFwKG0gPT4gbS5wcmVwcm9jZXNzKHRoaXMsIHRoaXMucHJvZ3JhbURlc2NyaXB0aW9uLnVuaWZvcm1zKSkpO1xuICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXBwbHkobWF0QXJnOiBJQXBwbHlNYXRlcmlhbEFyZ3VtZW50LCB1bmlmb3JtUmVnaXN0ZXJzOiBCYXNpY1JlZ2lzdGVyZXJbXSwgbWF0ZXJpYWw6IE1hdGVyaWFsKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnJlYWR5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbml0aWFsaXphdGlvbiB3YXMgbm90IGNvbXBsZXRlZCB5ZXQhXCIpO1xuICAgIH1cbiAgICBjb25zdCBnbCA9IG1hdEFyZy5yZW5kZXJTdGFnZS5HTDtcbiAgICBjb25zdCBwV3JhcHBlciA9IHRoaXMucHJvZ3JhbS5nZXRGb3JDb250ZXh0KG1hdEFyZy5yZW5kZXJTdGFnZS5SZW5kZXJlci5DYW52YXMpO1xuICAgIGNvbnN0IHJlbmRlckNvbmZpZyA9IHRoaXMuX2ZldGNoUmVuZGVyQ29uZmlndXJlKG1hdEFyZyk7XG4gICAgWE1MUmVuZGVyQ29uZmlnVXRpbGl0eS5hcHBseUFsbChnbCwgcmVuZGVyQ29uZmlnKTtcbiAgICAvLyBEZWNsYXJlIHVzaW5nIHByb2dyYW0gYmVmb3JlIGFzc2lnbmluZyBtYXRlcmlhbCB2YXJpYWJsZXNcbiAgICBwV3JhcHBlci51c2VQcm9ncmFtKCk7XG4gICAgLy8gQXBwbHkgYXR0cmlidXRlIHZhcmlhYmxlcyBieSBnZW9tZXRyaWVzXG4gICAgbWF0QXJnLm9iamVjdC5HZW9tZXRyeS5hcHBseUF0dHJpYnV0ZVZhcmlhYmxlcyhwV3JhcHBlciwgdGhpcy5wcm9ncmFtRGVzY3JpcHRpb24uYXR0cmlidXRlcyk7XG4gICAgLy8gQXBwbHkgdW5pZm9ybSB2YXJpYWJsZXNcbiAgICB1bmlmb3JtUmVnaXN0ZXJzLmZvckVhY2goKHIpID0+IHtcbiAgICAgIHIucmVnaXN0ZXIoZ2wsIHBXcmFwcGVyLCBtYXRBcmcsIHRoaXMucHJvZ3JhbURlc2NyaXB0aW9uLnVuaWZvcm1zKTtcbiAgICB9KTtcbiAgICBtYXRlcmlhbC5yZWdpc3Rlck1hdGVyaWFsVmFyaWFibGVzKG1hdEFyZy5yZW5kZXJTdGFnZS5SZW5kZXJlciwgcFdyYXBwZXIsIHRoaXMucHJvZ3JhbURlc2NyaXB0aW9uLnVuaWZvcm1zKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfX3ByZXByb2Nlc3NVbmlmb3JtVmFyaWFibGVzKCk6IHZvaWQge1xuICAgIC8vIFByZXByb2Nlc3MgZGVmYXVsdCB2YWx1ZSBmb3IgdW5pZm9ybXNcbiAgfVxuXG4gIHByaXZhdGUgX2ZldGNoUmVuZGVyQ29uZmlndXJlKG1hdEFyZzogSUFwcGx5TWF0ZXJpYWxBcmd1bWVudCk6IElSZW5kZXJTdGFnZVJlbmRlckNvbmZpZ3VyZSB7XG4gICAgY29uc3QgaWQgPSBtYXRBcmcucmVuZGVyU3RhZ2UuSUQ7XG4gICAgbGV0IHJlc3VsdDogSVJlbmRlclN0YWdlUmVuZGVyQ29uZmlndXJlO1xuICAgIGlmICh0aGlzLl9yZW5kZXJDb25maWd1cmVDYWNoZVtpZF0pIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMuX3JlbmRlckNvbmZpZ3VyZUNhY2hlW2lkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29uZmlndXJlID0gWE1MUmVuZGVyQ29uZmlnVXRpbGl0eS5wYXJzZVJlbmRlckNvbmZpZyh0aGlzLl9wYXNzRG9jdW1lbnQsIG1hdEFyZy5yZW5kZXJTdGFnZS5nZXREZWZhdWx0UmVuZGVyZXJDb25maWd1cmUobWF0QXJnLnRlY2huaXF1ZUluZGV4KSk7XG4gICAgICB0aGlzLl9yZW5kZXJDb25maWd1cmVDYWNoZVtpZF0gPSBjb25maWd1cmU7XG4gICAgICByZXN1bHQgPSBjb25maWd1cmU7XG4gICAgfVxuICAgIHRoaXMuX21hdGVyaWFsLmVtaXQoXCJjb25maWd1cmVcIiwgPElDb25maWd1cmVFdmVudEFyZ3M+e1xuICAgICAgcGFzczogdGhpcyxcbiAgICAgIHBhc3NJbmRleDogdGhpcy5wYXNzSW5kZXgsXG4gICAgICBtYXRlcmlhbDogdGhpcy5fbWF0ZXJpYWwsXG4gICAgICBjb25maWd1cmU6IHJlc3VsdFxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuXG4gIHByaXZhdGUgX2NvbnN0cnVjdFByb2dyYW0oaWRQcmVmaXg6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX3Bhc3NJZCA9IGlkUHJlZml4O1xuICAgIHRoaXMuZnJhZ21lbnRTaGFkZXIgPSBNYXRlcmlhbFBhc3MuX3Jlc291cmNlTWFuYWdlci5jcmVhdGVTaGFkZXIoaWRQcmVmaXggKyBcIi1mc1wiLCB0aGlzLnByb2dyYW1EZXNjcmlwdGlvbi5mcmFnbWVudCwgV2ViR0xSZW5kZXJpbmdDb250ZXh0LkZSQUdNRU5UX1NIQURFUik7XG4gICAgdGhpcy52ZXJ0ZXhTaGFkZXIgPSBNYXRlcmlhbFBhc3MuX3Jlc291cmNlTWFuYWdlci5jcmVhdGVTaGFkZXIoaWRQcmVmaXggKyBcIi12c1wiLCB0aGlzLnByb2dyYW1EZXNjcmlwdGlvbi52ZXJ0ZXgsIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5WRVJURVhfU0hBREVSKTtcbiAgICB0aGlzLmZyYWdtZW50U2hhZGVyLmxvYWRBbGwoKTtcbiAgICB0aGlzLnZlcnRleFNoYWRlci5sb2FkQWxsKCk7XG4gICAgdGhpcy5wcm9ncmFtID0gTWF0ZXJpYWxQYXNzLl9yZXNvdXJjZU1hbmFnZXIuY3JlYXRlUHJvZ3JhbShpZFByZWZpeCArIFwiLXByb2dyYW1cIiwgW3RoaXMudmVydGV4U2hhZGVyLCB0aGlzLmZyYWdtZW50U2hhZGVyXSk7XG4gIH1cblxuXG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0IF9yZXNvdXJjZU1hbmFnZXIoKTogUmVzb3VyY2VNYW5hZ2VyIHtcbiAgICByZXR1cm4gSlRocmVlQ29udGV4dC5nZXRDb250ZXh0Q29tcG9uZW50PFJlc291cmNlTWFuYWdlcj4oQ29udGV4dENvbXBvbmVudHMuUmVzb3VyY2VNYW5hZ2VyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXRlcmlhbFBhc3M7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=