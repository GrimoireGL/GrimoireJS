import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import J3Event from "./J3Event";
import {EventEmitter} from "events";
import isArray from "lodash.isarray";

class EventOrganizer extends EventEmitter {
  private _node: GomlTreeNodeBase;

  constructor(node: GomlTreeNodeBase) {
    super();
    this._node = node;
  }

  public capture(eventTypeString: string, handler: (eventObject: J3Event, ...extraParameter: any[]) => void, data: any): ((e: J3Event) => void)[] {
    let boundArgu = [];
    if (!isArray(data)) {
      boundArgu = [data];
    } else {
      boundArgu = data;
    }
    // TODO: pnly event namespace
    return eventTypeString.split(" ").map((eventType) => {
      const boundHandler = (e: J3Event) => {
        e.data = data;
        boundArgu.unshift(e);
        handler.apply(this._node, boundArgu);
      };
      this.on(eventType, boundHandler);
      return boundHandler;
    });
  }

  public release(eventTypeString: string, boundHandlers: ((e: J3Event) => void)[]): void;
  public release(eventTypeString: string, boundHandler: (e: J3Event) => void): void;
  public release(eventTypeString: string, boundHandler: any): void {
    let boundHandlers: ((e: J3Event) => void)[] = boundHandler;
    if (!isArray(boundHandler)) {
      boundHandlers = [boundHandler];
    }
    eventTypeString.split(" ").forEach((eventType) => {
      boundHandlers.forEach((bh) => {
        this.removeListener(eventType, bh);
      });
    });
  }

  public bubble(eventType: string, e: J3Event): void {
    e.currentTarget = this._node;
    this.emit(eventType, e);
    if (e.isPropagationStopped()) {
      this._propagateTo(<GomlTreeNodeBase>this._node.parent, eventType, e);
    }
  }

  private _propagateTo(node: GomlTreeNodeBase, eventType: string, e: J3Event): void {
    const parentEventOrganizer = (node).props.getProp<EventOrganizer>("event");
    if (parentEventOrganizer) {
      e.currentTarget = node;
      parentEventOrganizer.bubble(eventType, e);
    } else {
      if (node.parent) {
        this._propagateTo(<GomlTreeNodeBase>node.parent, eventType, e);
      } // else, propagate to scene root.
    }
  }
}

export default EventOrganizer;
