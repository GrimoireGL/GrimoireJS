import JThreeObject from "../../Base/JThreeObject";
class ResourceArray extends JThreeObject {
    constructor(...args) {
        super(...args);
        this._resourceArray = {};
        this._handlerArray = {};
    }
    create(id, creationFunc) {
        let resource;
        if (this._resourceArray[id]) {
            resource = this._resourceArray[id];
            return resource;
        }
        else {
            resource = creationFunc();
            this._resourceArray[id] = resource;
            const handlers = this._handlerArray[id];
            if (handlers) {
                handlers.forEach(v => v(resource));
            }
            return resource;
        }
    }
    get(id) {
        return this._resourceArray[id];
    }
    has(id) {
        return !!this._resourceArray[id];
    }
    getHandler(id, handler) {
        if (this.has(id)) {
            handler(this.get(id));
        }
        else {
            if (this._handlerArray[id]) {
                this._handlerArray[id].push(handler);
            }
            else {
                this._handlerArray[id] = [handler];
            }
        }
    }
}
export default ResourceArray;
