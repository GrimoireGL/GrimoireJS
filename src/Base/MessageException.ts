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
      const components = this.node.getComponents<Component>();
      let componentMessage = "";
      for (let i = 0; i < components.length; i++) {
        const singleComponent = components[i];
        let marker = "";
        if (this.component === singleComponent) {
          marker = "<<<<<<<<< This component";
        }
        componentMessage += `  (${i})  <${singleComponent.name.fqn}>  ${marker}\n\n   Attributes:\n`;
        singleComponent.attributes.forEach(a => {
          try {
            componentMessage += `    ${a.name.fqn} --- ${a.Value}\n`;
          } catch (e) {
            componentMessage += `    ${a.name.fqn} --- Failed to fetch\n`;
          }
        });
        componentMessage += "\n\n";
      }
      this.message = `[${error.name}]: ${error.message}\n\nThis exception was thrown in message function. Following information are snapshot of GOML tree status.\n\n* Node:  <${node.toString()}>\n* Component:  <${component.name.fqn}>\n* Message:  ${messageName} \n\n* Node map:\n ${node.toStructualString(`--------(Error was thrown from ${component.name.fqn} component of this node.)`)}\n\n* Components of this node:\n${componentMessage}\n\n`;
    } else {
      this.message = `${error.message}\n [Message stack]: ${this.messageName} at <${this.component.name.fqn}> on <${this.node.toString()}>\n`;
    }
    this.stack = error.stack;
    const proto = Object.getPrototypeOf(this);
    proto.name = "MessageException";
    proto.message = this.message;
  }

  public toString(): string {
    return this.message;
  }
}
