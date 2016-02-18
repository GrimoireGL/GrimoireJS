import JThreeObject from "../../Base/JThreeObject";
import {Action1, Func0} from "./../../Base/Delegates";
class ResourceArray<T> extends JThreeObject {
  private resourceArray: { [key: string]: T } = {};

  private handlerArray: { [id: string]: Action1<T>[] } = {};

  public create(id: string, creationFunc: Func0<T>) {
    let resource;
    if (this.resourceArray[id]) {
      resource = this.resourceArray[id];
      return resource;
    } else {
      resource = creationFunc();
      this.resourceArray[id] = resource;
      const handlers = this.handlerArray[id];
      if (handlers) {
        handlers.forEach(v => v(resource));
      }
      return resource;
    }
  }

  public get(id: string): T {
    return this.resourceArray[id];
  }

  public has(id: string): boolean {
    return !!this.resourceArray[id];
  }

  public getHandler(id: string, handler: Action1<T>) {
    if (this.has(id)) {
      handler(this.get(id));
    } else {
      if (this.handlerArray[id]) {
        this.handlerArray[id].push(handler);
      } else {
        this.handlerArray[id] = [handler];
      }
    }
  }
}

export default ResourceArray;
