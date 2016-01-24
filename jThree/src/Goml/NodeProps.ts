import events = require("events");
import Delegate = require("../Base/Delegates");

interface IProps {
  [key: string]: any;
}

class NodeProps extends events.EventEmitter {
  private props: IProps = {};

  constructor() {
    super();
  }

  /**
   * set Prop. Relative events is fired.
   * @param  {string} key   [description]
   * @param  {any}    value [description]
   * @return {IProps}       [description]
   */
  public setProp<T>(key: string, value: T): IProps {
    this.props[key] = value;
    this.emit(key, value);
    return { [key]: value };
  }

  /**
   * Set event listener to prop.
   * instantly_exec is true, callbackfn will be called instantly.
   * @param  {string}                key            [description]
   * @param  {Delegate.Action1<any>} callbackfn     [description]
   * @param  {boolean}               instantly_exec [description]
   * @return {Delegate.Action1<any>}                [description]
   */
  public setEventToProp<T>(key: string, callbackfn: Delegate.Action1<T>, instantly_exec?: boolean): Delegate.Action1<T> {
    this.on(key, callbackfn);
    if (instantly_exec && this.props[key] !== undefined) {
      callbackfn(this.props[key]);
    }
    return callbackfn;
  }

  /**
   * Get props.
   * This method is not recommended to use due to lack of consistency.
   * Use #setEventToProp to add change handler.
   *
   * @param  {string} key [description]
   * @return {any}        [description]
   */
  public getProp<T>(key: string): T {
    return this.props[key];
  }
}

export = NodeProps;
