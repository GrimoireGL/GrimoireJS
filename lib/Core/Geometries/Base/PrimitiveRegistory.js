import ConeGeometry from "../ConeGeometry";
import CylinderGeometry from "../CylinderGeometry";
import CubeGeometry from "../CubeGeometry";
import SphereGeometry from "../SphereGeometry";
import QuadGeometry from "../QuadGeometry";
import ContextComponents from "../../../ContextComponents";
class PrimitiveRegistory {
    constructor() {
        /**
         * Registered primitives
         */
        this._primitives = {};
    }
    getContextComponentIndex() {
        return ContextComponents.PrimitiveRegistory;
    }
    registerDefaultPrimitives() {
        this.registerPrimitive("quad", new QuadGeometry("quad"));
        this.registerPrimitive("sphere", new SphereGeometry("sphere"));
        this.registerPrimitive("cube", new CubeGeometry("cube"));
        this.registerPrimitive("cylinder", new CylinderGeometry("cylinder"));
        this.registerPrimitive("cone", new ConeGeometry("cone"));
    }
    registerPrimitive(key, geo) {
        this._primitives[key] = geo;
    }
    deregisterPrimitive(key) {
        delete this._primitives[key];
    }
    getPrimitive(key) {
        return this._primitives[key];
    }
}
export default PrimitiveRegistory;
