import J3Object from "../J3Object";
import J3ObjectBase from "../J3ObjectBase";
import J3Event from "./J3Event";
import IEventArgu from "./IEventArgu";
import isPlainObject from "lodash.isplainobject";
import isString from "lodash.isstring";
import isFunction from "lodash.isfunction";
import isArray from "lodash.isarray";
import isUndefined from "lodash.isundefined";
import EventOrganizer from "./EventOrgnizer";

class EventHandlerAttachment extends J3ObjectBase {
  public on(event: string, handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
  public on(event: string, selector: string, handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
  public on(event: string, data: {[key: string]: any}, handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
  public on(event: string, data: any[], handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
  public on(event: string, selector: string, data: {[key: string]: any}, handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
  public on(event: string, selector: string, data: any[], handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
  public on(events: {[key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void}): J3Object;
  public on(events: {[key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void}, selector: string): J3Object;
  public on(events: {[key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void}, data: {[key: string]: any}): J3Object;
  public on(events: {[key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void}, data: any[]): J3Object;
  public on(events: {[key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void}, selector: string, data: {[key: string]: any}): J3Object;
  public on(events: {[key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void}, selector: string, data: any[]): J3Object;
  public on(event: string, handler: boolean): J3Object;
  public on(event: string, selector: string, handler: boolean): J3Object;
  public on(event: string, data: {[key: string]: any}, handler: boolean): J3Object;
  public on(event: string, data: any[], handler: boolean): J3Object;
  public on(event: string, selector: string, data: {[key: string]: any}, handler: boolean): J3Object;
  public on(event: string, selector: string, data: any[], handler: boolean): J3Object;
  public on(events: {[key: string]: boolean}): J3Object;
  public on(events: {[key: string]: boolean}, selector: string): J3Object;
  public on(events: {[key: string]: boolean}, data: {[key: string]: any}): J3Object;
  public on(events: {[key: string]: boolean}, data: any[]): J3Object;
  public on(events: {[key: string]: boolean}, selector: string, data: {[key: string]: any}): J3Object;
  public on(events: {[key: string]: boolean}, selector: string, data: any[]): J3Object;
  public on(argu0: any, argu1?: any, argu2?: any, argu3?: any): any {
    const eventData: IEventArgu = {
      events: {},
      data: null,
      selector: null,
    };
    let isEvents = false;
    const falseHandler: (eventObject: J3Event, ...extraParameter: any[]) => void = function(e) {
      e.preventDefault();
      e.stopPropagation();
    };
    switch (true) {
      case isString(argu0):
        eventData.events[argu0] = null;
        break;
      case isPlainObject(argu0):
        isEvents = true;
        eventData.events = argu0;
        break;
      default:
        throw new Error("Argument type is not correct");
    }
    switch (true) {
      case (isUndefined(argu1) && isEvents):
        break;
      case (isFunction(argu1) && !isEvents):
        eventData.events[argu0] = argu1;
        break;
      case (argu1 === false):
        eventData.events[argu1] = falseHandler;
        break;
      case isString(argu1):
        eventData.selector = argu1;
        switch (true) {
          case (isUndefined(argu2) && isEvents):
            break;
          case (isFunction(argu2) && !isEvents):
            eventData.events[argu0] = argu2;
            break;
          case (argu2 === false):
            eventData.events[argu2] = falseHandler;
            break;
          case isArray(argu2) || isPlainObject(argu2):
            eventData.data = argu2;
            switch (true) {
              case (isUndefined(argu3) && isEvents):
                break;
              case (isFunction(argu3) && !isEvents):
                eventData.events[argu0] = argu3;
                break;
              case (argu3 === false):
                eventData.events[argu3] = falseHandler;
                break;
              default:
                throw new Error("Argument type is not correct");
            }
            break;
          default:
            throw new Error("Argument type is not correct");
        }
        break;
      case isArray(argu1) || isPlainObject(argu1):
        eventData.data = argu1;
        switch (true) {
          case (isUndefined(argu2) && isEvents):
            break;
          case (isFunction(argu2) && !isEvents):
            eventData.events[argu0] = argu2;
            break;
          case (argu2 === false):
            eventData.events[argu2] = falseHandler;
            break;
          default:
            throw new Error("Argument type is not correct");
        }
        break;
      default:
        throw new Error("Argument type is not correct");
    }
    if (eventData.selector) {
      throw new Error("Not implemented yet");
    }
    Object.keys(eventData.events).forEach((eventTypeString) => {
      this.__getArray().forEach((node) => {
        let eventOrganizer = node.props.getProp<EventOrganizer>("event");
        if (!eventOrganizer) {
          eventOrganizer = new EventOrganizer(node);
          node.props.setProp("event", eventOrganizer);
        }
        eventOrganizer.capture(eventTypeString, eventData.events[eventTypeString], eventData.data);
      });
    });
    return this;
  }

  public off(events: string, selector: string, handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
  public off(events: string, handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
  public off(events: string, selector: string): J3Object;
  public off(events: string): J3Object;
  public off(events: {[key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void}, selector: string): J3Object;
  public off(events: {[key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void}): J3Object;
  public off(): J3Object;
  public off(argu0?: any, argu1?: any, argu2?: any): any {
    const eventData: IEventArgu = {
      events: {},
      data: null,
      selector: null,
    };
    let removeAll = false;
    let isEvents = false;
    switch (true) {
      case isUndefined(argu0):
        removeAll = true;
        break;
      case isString(argu0):
        eventData.events[argu0] = null;
        break;
      case isPlainObject(argu0):
        isEvents = true;
        eventData.events = argu0;
        break;
      default:
        throw new Error("Argument type is not correct");
    }
    switch (true) {
      case (removeAll):
      case (isUndefined(argu1) && isString(argu0)):
      case (isUndefined(argu1) && isEvents):
        break;
      case (isFunction(argu1) && !isEvents):
        eventData.events[argu0] = argu1;
        break;
      case isString(argu1):
        eventData.selector = argu1;
        switch (true) {
          case (isUndefined(argu2) && isEvents):
            break;
          case (isFunction(argu2) && !isEvents):
            eventData.events[argu0] = argu2;
            break;
          default:
            throw new Error("Argument type is not correct");
        }
        break;
      default:
        throw new Error("Argument type is not correct");
    }
    if (eventData.selector) {
      throw new Error("Not implemented yet");
    }
    if (removeAll) {
      this.__getArray().forEach((node) => {
        let eventOrganizer = node.props.getProp<EventOrganizer>("event");
        if (eventOrganizer) {
          eventOrganizer.releaseAll();
        }
      });
    } else {
      Object.keys(eventData.events).forEach((eventTypeString) => {
        this.__getArray().forEach((node) => {
          let eventOrganizer = node.props.getProp<EventOrganizer>("event");
          if (eventOrganizer) {
            if (eventData.events[eventTypeString]) {
              eventOrganizer.release(eventTypeString, eventData.events[eventTypeString]);
            } else {
              eventOrganizer.releaseAll(eventTypeString);
            }
          }
        });
      });
    }
  }
}

export default EventHandlerAttachment;
