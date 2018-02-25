import Component from "../Core/Component";
import GomlNode from "../Core/GomlNode";

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
      const components = this.node.getComponents<Component>();
      let componentMessage = "";
      for (let i = 0; i < components.length; i++) {
        const singleComponent = components[i];
        let marker = "";
        if (this.component === singleComponent) {
          marker = "<<<<<<<<< This component";
        }
        componentMessage += `  (${i})  <${singleComponent.identity.fqn}>  ${marker}\n\n   Attributes:\n`;
        singleComponent.attributes.forEach(a => {
          try {
            componentMessage += `    ${a.identity.fqn} --- ${a.Value}\n`;
          } catch (e) {
            componentMessage += `    ${a.identity.fqn} --- Failed to fetch\n`;
          }
        });
        componentMessage += "\n\n";
      }
      this.message = `[${error.name}]: ${error.message}\n\nThis exception was thrown in message function. Following information are snapshot of GOML tree status.\n\n* Node:  <${node.toString()}>\n* Component:  <${component.identity.fqn}>\n* Message:  ${messageName} \n\n* Node map:\n ${node.toStructualString(`--------(Error was thrown from ${component.identity.fqn} component of this node.)`)}\n\n* Components of this node:\n${componentMessage}\n\n`;
    } else {
      this.message = `${error.message}\n [Message stack]: ${this.messageName} at <${this.component.identity.fqn}> on <${this.node.toString()}>\n`;
    }
    this.stack = error.stack;
    const proto = Object.getPrototypeOf(this);
    proto.name = "MessageException";
    proto.message = this.message;
  }

  /**
   * to string
   */
  public toString(): string {
    return this.message;
  }
}
