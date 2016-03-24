import BasicRegisterer from "./Registerer/BasicRegisterer";
import StageDescriptionRegisterer from "./Registerer/StageDescriptionRegisterer";
import BasicMaterial from "./BasicMaterial";
import ShaderParser from "./ShaderParser";
import ContextComponents from "../../../ContextComponents";
import BufferRegisterer from "./Registerer/BufferRegisterer";
import TimeRegisterer from "./Registerer/TimeRegisterer";
import AsyncLoader from "../../Resources/AsyncLoader";
import Q from "q";
/**
 * A ContextComponent provides the feature to manage materials.
 * @type {[type]}
 */
class MaterialManager {
    constructor() {
        this._uniformRegisters = {};
        this._materialDocuments = {};
        this._chunkLoader = new AsyncLoader();
        this.addShaderChunk("builtin.packing", require("../BuiltIn/Chunk/_Packing.glsl"));
        this.addShaderChunk("builtin.gbuffer-packing", require("../BuiltIn/GBuffer/_GBufferPacking.glsl"));
        this.addShaderChunk("jthree.builtin.vertex", require("../BuiltIn/Vertex/_BasicVertexTransform.glsl"));
        this.addShaderChunk("jthree.builtin.shadowfragment", require("../BuiltIn/ShadowMap/_ShadowMapFragment.glsl"));
        this.addShaderChunk("builtin.gbuffer-reader", require("../BuiltIn/Light/Chunk/_LightAccumulation.glsl"));
        this.addUniformRegister(BasicRegisterer);
        this.addUniformRegister(TimeRegisterer);
        // this.addUniformRegister(TextureRegister);
        this.addUniformRegister(BufferRegisterer);
        this.addUniformRegister(StageDescriptionRegisterer);
        this.registerMaterial(require("../BuiltIn/Materials/Phong.html"));
        this.registerMaterial(require("../BuiltIn/Materials/SolidColor.html"));
    }
    getContextComponentIndex() {
        return ContextComponents.MaterialManager;
    }
    /**
     * Add shader chunk code to be stored.
     * @param {string} key shader chunk key
     * @param {string} val shader chunk code
     */
    addShaderChunk(key, val) {
        this._chunkLoader.pushLoaded(key, ShaderParser.parseInternalImport(val, this));
    }
    loadChunks(srcs) {
        return Q.all(srcs.map(src => this._loadChunk(src)));
    }
    /**
     * Get shader chunk code from storage
     * @param  {string} key shader chunk key
     * @return {string}     stored shader chunk code
     */
    getShaderChunk(key) {
        return this._chunkLoader.fromCache(key);
    }
    addUniformRegister(registerer) {
        this._uniformRegisters[registerer.prototype["getName"]()] = registerer;
    }
    getUniformRegister(key) {
        return this._uniformRegisters[key];
    }
    /**
     * Register material document(XMML) in material manager
     * @param {string} matDocument Raw xmml parsable string
     * @return {string}             material tag's name attribute
     */
    registerMaterial(matDocument) {
        const dom = (new DOMParser()).parseFromString(matDocument, "text/xml");
        const matTag = dom.querySelector("material");
        const matName = matTag.getAttribute("name");
        if (!matName) {
            console.error("Material name is required attribute,but name was not specified!");
        }
        else {
            this._materialDocuments[matName] = matDocument;
        }
        return matName;
    }
    registerCondition(type, checker) {
        // TODO:implement
    }
    getConditionChecker(type) {
        return null;
        // todo:implement
    }
    /**
     * Construct BasicMaterial instance with registered xmml
     * @param  {string}        matName name of the xmml
     * @return {BasicMaterial}         [description]
     */
    constructMaterial(matName) {
        const matDoc = this._materialDocuments[matName];
        if (!matDoc) {
            // console.error(`Specified material name '${matName}' was not found!`);
            return undefined;
        }
        else {
            return new BasicMaterial(matDoc);
        }
    }
    _loadChunk(src) {
        return this._chunkLoader.fetch(src, (absPath) => {
            const deferred = Q.defer();
            const xhr = new XMLHttpRequest();
            xhr.open("GET", absPath, true);
            xhr.setRequestHeader("Accept", "text");
            xhr.onload = () => {
                this.loadChunks(ShaderParser.getImports(xhr.responseText));
                ShaderParser.parseImport(xhr.responseText, this).then((source) => {
                    deferred.resolve(source);
                });
            };
            xhr.onerror = (err) => {
                deferred.reject(err);
            };
            xhr.send(null);
            return deferred.promise;
        });
    }
}
export default MaterialManager;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvTWF0ZXJpYWxzL0Jhc2UvTWF0ZXJpYWxNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLGVBQWUsTUFBTSw4QkFBOEI7T0FFbkQsMEJBQTBCLE1BQU0seUNBQXlDO09BQ3pFLGFBQWEsTUFBTSxpQkFBaUI7T0FDcEMsWUFBWSxNQUFNLGdCQUFnQjtPQUVsQyxpQkFBaUIsTUFBTSw0QkFBNEI7T0FDbkQsZ0JBQWdCLE1BQU0sK0JBQStCO09BQ3JELGNBQWMsTUFBTSw2QkFBNkI7T0FDakQsV0FBVyxNQUFNLDZCQUE2QjtPQUU5QyxDQUFDLE1BQU0sR0FBRztBQUNqQjs7O0dBR0c7QUFDSDtJQVFFO1FBTlEsc0JBQWlCLEdBQWdELEVBQUUsQ0FBQztRQUVwRSx1QkFBa0IsR0FBOEIsRUFBRSxDQUFDO1FBRW5ELGlCQUFZLEdBQXdCLElBQUksV0FBVyxFQUFVLENBQUM7UUFHcEUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxjQUFjLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLHlDQUF5QyxDQUFDLENBQUMsQ0FBQztRQUNuRyxJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUF1QixFQUFFLE9BQU8sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDLENBQUM7UUFDdEcsSUFBSSxDQUFDLGNBQWMsQ0FBQywrQkFBK0IsRUFBRSxPQUFPLENBQUMsOENBQThDLENBQUMsQ0FBQyxDQUFDO1FBQzlHLElBQUksQ0FBQyxjQUFjLENBQUMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLGdEQUFnRCxDQUFDLENBQUMsQ0FBQztRQUN6RyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hDLDRDQUE0QztRQUM1QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdC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LFFBQVEsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFVLENBQUM7WUFDbkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUNqQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDL0IsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN2QyxHQUFHLENBQUMsTUFBTSxHQUFHO2dCQUNYLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDM0QsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU07b0JBQzNELFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzNCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDO1lBQ0YsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUc7Z0JBQ2hCLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsQ0FBQyxDQUFDO1lBQ0YsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNmLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLGVBQWUsQ0FBQyIsImZpbGUiOiJDb3JlL01hdGVyaWFscy9CYXNlL01hdGVyaWFsTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNpY1JlZ2lzdGVyZXIgZnJvbSBcIi4vUmVnaXN0ZXJlci9CYXNpY1JlZ2lzdGVyZXJcIjtcbmltcG9ydCBSZWdpc3RlcmVyQmFzZSBmcm9tIFwiLi9SZWdpc3RlcmVyL1JlZ2lzdGVyZXJCYXNlXCI7XG5pbXBvcnQgU3RhZ2VEZXNjcmlwdGlvblJlZ2lzdGVyZXIgZnJvbSBcIi4vUmVnaXN0ZXJlci9TdGFnZURlc2NyaXB0aW9uUmVnaXN0ZXJlclwiO1xuaW1wb3J0IEJhc2ljTWF0ZXJpYWwgZnJvbSBcIi4vQmFzaWNNYXRlcmlhbFwiO1xuaW1wb3J0IFNoYWRlclBhcnNlciBmcm9tIFwiLi9TaGFkZXJQYXJzZXJcIjtcbmltcG9ydCBJQ29udGV4dENvbXBvbmVudCBmcm9tIFwiLi4vLi4vLi4vSUNvbnRleHRDb21wb25lbnRcIjtcbmltcG9ydCBDb250ZXh0Q29tcG9uZW50cyBmcm9tIFwiLi4vLi4vLi4vQ29udGV4dENvbXBvbmVudHNcIjtcbmltcG9ydCBCdWZmZXJSZWdpc3RlcmVyIGZyb20gXCIuL1JlZ2lzdGVyZXIvQnVmZmVyUmVnaXN0ZXJlclwiO1xuaW1wb3J0IFRpbWVSZWdpc3RlcmVyIGZyb20gXCIuL1JlZ2lzdGVyZXIvVGltZVJlZ2lzdGVyZXJcIjtcbmltcG9ydCBBc3luY0xvYWRlciBmcm9tIFwiLi4vLi4vUmVzb3VyY2VzL0FzeW5jTG9hZGVyXCI7XG5pbXBvcnQgSUNvbmRpdGlvbkNoZWNrZXIgZnJvbSBcIi4vSUNvbmRpdGlvbkNoZWNrZXJcIjtcbmltcG9ydCBRIGZyb20gXCJxXCI7XG4vKipcbiAqIEEgQ29udGV4dENvbXBvbmVudCBwcm92aWRlcyB0aGUgZmVhdHVyZSB0byBtYW5hZ2UgbWF0ZXJpYWxzLlxuICogQHR5cGUge1t0eXBlXX1cbiAqL1xuY2xhc3MgTWF0ZXJpYWxNYW5hZ2VyIGltcGxlbWVudHMgSUNvbnRleHRDb21wb25lbnQge1xuXG4gIHByaXZhdGUgX3VuaWZvcm1SZWdpc3RlcnM6IHsgW2tleTogc3RyaW5nXTogbmV3ICgpID0+IFJlZ2lzdGVyZXJCYXNlIH0gPSB7fTtcblxuICBwcml2YXRlIF9tYXRlcmlhbERvY3VtZW50czogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuXG4gIHByaXZhdGUgX2NodW5rTG9hZGVyOiBBc3luY0xvYWRlcjxzdHJpbmc+ID0gbmV3IEFzeW5jTG9hZGVyPHN0cmluZz4oKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFkZFNoYWRlckNodW5rKFwiYnVpbHRpbi5wYWNraW5nXCIsIHJlcXVpcmUoXCIuLi9CdWlsdEluL0NodW5rL19QYWNraW5nLmdsc2xcIikpO1xuICAgIHRoaXMuYWRkU2hhZGVyQ2h1bmsoXCJidWlsdGluLmdidWZmZXItcGFja2luZ1wiLCByZXF1aXJlKFwiLi4vQnVpbHRJbi9HQnVmZmVyL19HQnVmZmVyUGFja2luZy5nbHNsXCIpKTtcbiAgICB0aGlzLmFkZFNoYWRlckNodW5rKFwianRocmVlLmJ1aWx0aW4udmVydGV4XCIsIHJlcXVpcmUoXCIuLi9CdWlsdEluL1ZlcnRleC9fQmFzaWNWZXJ0ZXhUcmFuc2Zvcm0uZ2xzbFwiKSk7XG4gICAgdGhpcy5hZGRTaGFkZXJDaHVuayhcImp0aHJlZS5idWlsdGluLnNoYWRvd2ZyYWdtZW50XCIsIHJlcXVpcmUoXCIuLi9CdWlsdEluL1NoYWRvd01hcC9fU2hhZG93TWFwRnJhZ21lbnQuZ2xzbFwiKSk7XG4gICAgdGhpcy5hZGRTaGFkZXJDaHVuayhcImJ1aWx0aW4uZ2J1ZmZlci1yZWFkZXJcIiwgcmVxdWlyZShcIi4uL0J1aWx0SW4vTGlnaHQvQ2h1bmsvX0xpZ2h0QWNjdW11bGF0aW9uLmdsc2xcIikpO1xuICAgIHRoaXMuYWRkVW5pZm9ybVJlZ2lzdGVyKEJhc2ljUmVnaXN0ZXJlcik7XG4gICAgdGhpcy5hZGRVbmlmb3JtUmVnaXN0ZXIoVGltZVJlZ2lzdGVyZXIpO1xuICAgIC8vIHRoaXMuYWRkVW5pZm9ybVJlZ2lzdGVyKFRleHR1cmVSZWdpc3Rlcik7XG4gICAgdGhpcy5hZGRVbmlmb3JtUmVnaXN0ZXIoQnVmZmVyUmVnaXN0ZXJlcik7XG4gICAgdGhpcy5hZGRVbmlmb3JtUmVnaXN0ZXIoU3RhZ2VEZXNjcmlwdGlvblJlZ2lzdGVyZXIpO1xuICAgIHRoaXMucmVnaXN0ZXJNYXRlcmlhbChyZXF1aXJlKFwiLi4vQnVpbHRJbi9NYXRlcmlhbHMvUGhvbmcuaHRtbFwiKSk7XG4gICAgdGhpcy5yZWdpc3Rlck1hdGVyaWFsKHJlcXVpcmUoXCIuLi9CdWlsdEluL01hdGVyaWFscy9Tb2xpZENvbG9yLmh0bWxcIikpO1xuICB9XG5cbiAgcHVibGljIGdldENvbnRleHRDb21wb25lbnRJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiBDb250ZXh0Q29tcG9uZW50cy5NYXRlcmlhbE1hbmFnZXI7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHNoYWRlciBjaHVuayBjb2RlIHRvIGJlIHN0b3JlZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBzaGFkZXIgY2h1bmsga2V5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWwgc2hhZGVyIGNodW5rIGNvZGVcbiAgICovXG4gIHB1YmxpYyBhZGRTaGFkZXJDaHVuayhrZXk6IHN0cmluZywgdmFsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9jaHVua0xvYWRlci5wdXNoTG9hZGVkKGtleSwgU2hhZGVyUGFyc2VyLnBhcnNlSW50ZXJuYWxJbXBvcnQodmFsLCB0aGlzKSk7XG4gIH1cblxuICBwdWJsaWMgbG9hZENodW5rcyhzcmNzOiBzdHJpbmdbXSk6IFEuSVByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gUS5hbGwoc3Jjcy5tYXAoc3JjID0+IHRoaXMuX2xvYWRDaHVuayhzcmMpKSk7XG4gIH1cblxuXG5cbiAgLyoqXG4gICAqIEdldCBzaGFkZXIgY2h1bmsgY29kZSBmcm9tIHN0b3JhZ2VcbiAgICogQHBhcmFtICB7c3RyaW5nfSBrZXkgc2hhZGVyIGNodW5rIGtleVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICBzdG9yZWQgc2hhZGVyIGNodW5rIGNvZGVcbiAgICovXG4gIHB1YmxpYyBnZXRTaGFkZXJDaHVuayhrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2NodW5rTG9hZGVyLmZyb21DYWNoZShrZXkpO1xuICB9XG5cbiAgcHVibGljIGFkZFVuaWZvcm1SZWdpc3RlcihyZWdpc3RlcmVyOiBuZXcgKCkgPT4gUmVnaXN0ZXJlckJhc2UpOiB2b2lkIHtcbiAgICB0aGlzLl91bmlmb3JtUmVnaXN0ZXJzW3JlZ2lzdGVyZXIucHJvdG90eXBlW1wiZ2V0TmFtZVwiXSgpIGFzIHN0cmluZ10gPSByZWdpc3RlcmVyO1xuICB9XG5cbiAgcHVibGljIGdldFVuaWZvcm1SZWdpc3RlcihrZXk6IHN0cmluZyk6IG5ldyAoKSA9PiBSZWdpc3RlcmVyQmFzZSB7XG4gICAgcmV0dXJuIHRoaXMuX3VuaWZvcm1SZWdpc3RlcnNba2V5XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBtYXRlcmlhbCBkb2N1bWVudChYTU1MKSBpbiBtYXRlcmlhbCBtYW5hZ2VyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXREb2N1bWVudCBSYXcgeG1tbCBwYXJzYWJsZSBzdHJpbmdcbiAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICBtYXRlcmlhbCB0YWcncyBuYW1lIGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlZ2lzdGVyTWF0ZXJpYWwobWF0RG9jdW1lbnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgZG9tID0gKG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKG1hdERvY3VtZW50LCBcInRleHQveG1sXCIpO1xuICAgIGNvbnN0IG1hdFRhZyA9IGRvbS5xdWVyeVNlbGVjdG9yKFwibWF0ZXJpYWxcIik7XG4gICAgY29uc3QgbWF0TmFtZSA9IG1hdFRhZy5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpO1xuICAgIGlmICghbWF0TmFtZSkge1xuICAgICAgY29uc29sZS5lcnJvcihcIk1hdGVyaWFsIG5hbWUgaXMgcmVxdWlyZWQgYXR0cmlidXRlLGJ1dCBuYW1lIHdhcyBub3Qgc3BlY2lmaWVkIVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbWF0ZXJpYWxEb2N1bWVudHNbbWF0TmFtZV0gPSBtYXREb2N1bWVudDtcbiAgICB9XG4gICAgcmV0dXJuIG1hdE5hbWU7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJDb25kaXRpb24odHlwZTogc3RyaW5nLCBjaGVja2VyOiBJQ29uZGl0aW9uQ2hlY2tlcik6IHZvaWQge1xuICAgIC8vIFRPRE86aW1wbGVtZW50XG4gIH1cbiAgcHVibGljIGdldENvbmRpdGlvbkNoZWNrZXIodHlwZTogc3RyaW5nKTogSUNvbmRpdGlvbkNoZWNrZXIge1xuICAgIHJldHVybiBudWxsO1xuICAgIC8vIHRvZG86aW1wbGVtZW50XG4gIH1cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBCYXNpY01hdGVyaWFsIGluc3RhbmNlIHdpdGggcmVnaXN0ZXJlZCB4bW1sXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgIG1hdE5hbWUgbmFtZSBvZiB0aGUgeG1tbFxuICAgKiBAcmV0dXJuIHtCYXNpY01hdGVyaWFsfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RNYXRlcmlhbChtYXROYW1lOiBzdHJpbmcpOiBCYXNpY01hdGVyaWFsIHtcbiAgICBjb25zdCBtYXREb2MgPSB0aGlzLl9tYXRlcmlhbERvY3VtZW50c1ttYXROYW1lXTtcbiAgICBpZiAoIW1hdERvYykge1xuICAgICAgLy8gY29uc29sZS5lcnJvcihgU3BlY2lmaWVkIG1hdGVyaWFsIG5hbWUgJyR7bWF0TmFtZX0nIHdhcyBub3QgZm91bmQhYCk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IEJhc2ljTWF0ZXJpYWwobWF0RG9jKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9sb2FkQ2h1bmsoc3JjOiBzdHJpbmcpOiBRLklQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLl9jaHVua0xvYWRlci5mZXRjaChzcmMsIChhYnNQYXRoKSA9PiB7XG4gICAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXI8c3RyaW5nPigpO1xuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIub3BlbihcIkdFVFwiLCBhYnNQYXRoLCB0cnVlKTtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwidGV4dFwiKTtcbiAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMubG9hZENodW5rcyhTaGFkZXJQYXJzZXIuZ2V0SW1wb3J0cyh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgIFNoYWRlclBhcnNlci5wYXJzZUltcG9ydCh4aHIucmVzcG9uc2VUZXh0LCB0aGlzKS50aGVuKChzb3VyY2UpID0+IHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHNvdXJjZSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHhoci5vbmVycm9yID0gKGVycikgPT4ge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgIH07XG4gICAgICB4aHIuc2VuZChudWxsKTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hdGVyaWFsTWFuYWdlcjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
