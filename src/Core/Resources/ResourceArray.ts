import JThreeObject from "../../Base/JThreeObject";
import {Action1, Func0} from "./../../Base/Delegates";
class ResourceArray<T> extends JThreeObject {
  private _resourceArray: { [key: string]: T } = {};

  private _handlerArray: { [id: string]: Action1<T>[] } = {};

  public create(id: string, creationFunc: Func0<T>): { [key: string]: T } {
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

  public getHandler(id: string, handler: Action1<T>): void {
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
