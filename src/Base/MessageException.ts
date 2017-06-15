import GomlNode from "../Node/GomlNode";
import Component from "../Node/Component";
/**
 * Exception representing uncought error caused in message function.
 * Do not thorow this error manually.
 */
export default class MessageException extends Error {
  /**
   * If this flag was set by events, message system will ignore this exception.
   */
  public handled = false;

  private _isMessageException = true;
  constructor(public node: GomlNode, public component: Component, public messageName: string, public error: Error) {
    super();
    const isMessageException = (error as MessageException)._isMessageException;
    if (!isMessageException) {
      this.message = `[${error.name}]: ${error.message}\n\nThis exception was thrown in message function. Following information are snapshot of GOML tree status.\n\nNode:  <${node.toString()}>\nComponent:  <${component.name.fqn}>\nMessage:  ${messageName} \n\n Node map:\n ${node.toStructualString(`--------(Error was thrown from ${component.name.fqn} component of this node.)`)}\n\n`;
    } else {
      this.message = `${error.message}\n [Message stack]: ${this.messageName} at <${this.component.name.fqn}> on <${this.node.toString()}>\n`;
    }
    this.stack = error.stack;
  }
}
