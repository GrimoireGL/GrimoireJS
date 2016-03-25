import HitAreaRenderStage from "../../Core/Renderers/RenderStages/HitAreaRenderStage";
import BasicRenderer from "../../Core/Renderers/BasicRenderer";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import EventOrganizer from "./EventOrgnizer";
import J3Event from "./J3Event";

class EventBroadcaster {
  private _eventTap: BasicRenderer;
  private _eventListeners: {[key: string]: (() => void)} = {};
  private _hitAreaRenderStage: HitAreaRenderStage;

  constructor() {
    this._eventListeners["mouse-move"] = this._mouseMoveEvent.bind(this);
    this._eventListeners["mouse-leave"] = this._mouseLeaveEvent.bind(this);
    this._eventListeners["mouse-enter"] = this._mouseEnterEvent.bind(this);
    this._eventListeners["mouse-down"] = this._mouseDownEvent.bind(this);
    this._eventListeners["mouse-up"] = this._mouseUpEvent.bind(this);
  }

  public attachEvents(eventTap: BasicRenderer): void {
    this._eventTap = eventTap;
    Object.keys(this._eventListeners).forEach((k) => {
      this._eventTap.on(k, this._eventListeners[k]);
    });
    const renderPath = this._eventTap.renderPath.path;
    for (let i = renderPath.length - 1; i >= 0; i--) {
      if (renderPath[i].stage instanceof HitAreaRenderStage) {
        this._hitAreaRenderStage = <HitAreaRenderStage>renderPath[i].stage;
        break;
      }
    }
  }

  public detachEvents(): void {
    if (this._eventTap) {
      Object.keys(this._eventListeners).forEach((k) => {
        this._eventTap.removeListener(k, this._eventListeners[k]);
      });
      this._eventTap = null;
    }
  }

  private _mouseMoveEvent(eObj: any): void {
    return;
  }

  private _mouseLeaveEvent(eObj: any): void {
    return;
  }

  private _mouseEnterEvent(eObj: any): void {
    return;
  }

  private _mouseDownEvent(eObj: any): void {
    this._getTargetNode(eObj.mouseX, eObj.mouseY, (node) => {
      const eventOrganizer = node.props.getProp<EventOrganizer>("event");
      if (eventOrganizer) {
        const e = this._eventFormatter(eObj);
        e.type = "mousedown";
        e.target = node;
        eventOrganizer.bubble("mousedown", e);
      }
    });
  }

  private _mouseUpEvent(eObj: any): void {
    return;
  }

  private _eventFormatter(eObj: any): J3Event {
    const e = new J3Event(eObj);
    e.which = (<MouseEvent>e.eventSource).which;
    e.timeStamp = (new Date()).getTime();
    return e;
  }

  private _getTargetNode(x: number, y: number, callbackfn: (node: GomlTreeNodeBase) => void): void {
    this._hitAreaRenderStage.queryHitTest(x, y).then((sceneObject) => {
      callbackfn(sceneObject.relatedNode);
    });
  }
}

export default EventBroadcaster;
