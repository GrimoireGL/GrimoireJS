import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import CanvasRegion from "../../Core/Canvas/CanvasRegion";

class J3Event {
  public eventSource: MouseEvent | TouchEvent = null;
  public currentTarget: GomlTreeNodeBase = null;
  public data: any = null;
  public delegateTarget: GomlTreeNodeBase = null;
  public namespace: string = null;
  public relatedTarget: GomlTreeNodeBase = null;
  // not supported;
  // public result: any = null;
  public target: GomlTreeNodeBase = null;
  public timeStamp: number = null;
  public type: string = null;
  public which: number = null;

  // jThree original
  public mouseX: number = null;
  public mouseY: number = null;
  public mouseDiffX: number = null;
  public mouseDiffY: number = null;
  public region: CanvasRegion = null;

  private _propagationStopped: boolean = false;

  constructor(obj: {[key: string]: any}) {
    Object.keys(obj).forEach((k) => {
      if (typeof this[k] !== "undefined") {
        this[k] = obj[k];
      }
    });
  }

  public preventDefault(): void {
    this.eventSource.preventDefault();
  }

  public isDefaultPrevented(): boolean {
    return this.eventSource.defaultPrevented;
  }

  public stopPropagation(): void {
    this._propagationStopped = false;
  }

  public stopImmediatePropagation(): void {
    throw new Error("Not supported \"e.stopImmediatePropagation()\"");
  }

  public isPropagationStopped(): boolean {
    return this._propagationStopped;
  }

  public isImmediatePropagationStopped(): boolean {
    throw new Error("Not supported \"e.isImmediatePropagationStopped()\"");
  }
}

export default J3Event;
