import NamedValue from "../../Base/NamedValue";
import IDObject from "../../Base/IDObject";
class ResourceArray<T> extends IDObject {
  private _resourceArray: NamedValue<T> = {};

  private _handlerArray: { [id: string]: ((t: T) => void)[] } = {};

  public create(id: string, creationFunc: () => T): any {
    let resource;
    if (this._resourceArray[id]) {
      resource = this._resourceArray[id];
      return resource;
    } else {
      resource = creationFunc();
      this._resourceArray[id] = resource;
      const handlers = this._handlerArray[id];
      if (handlers) {
        handlers.forEach(v => v(resource));
      }
      return resource;
    }
  }

  public get(id: string): T {
    return this._resourceArray[id];
  }

  public has(id: string): boolean {
    return !!this._resourceArray[id];
  }

  public getHandler(id: string, handler: (h: T) => void): void {
    if (this.has(id)) {
      handler(this.get(id));
    } else {
      if (this._handlerArray[id]) {
        this._handlerArray[id].push(handler);
      } else {
        this._handlerArray[id] = [handler];
      }
    }
  }
}

export default ResourceArray;
