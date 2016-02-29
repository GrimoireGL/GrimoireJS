import {EventEmitter} from "events";

interface IProps {
  [key: string]: any;
}

class NodeProps extends EventEmitter {
  private _props: IProps = {};

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
    this._props[key] = value;
    this.emit(key, value);
    return { [key]: value };
  }

  /**
   * Set event listener to prop.
   * instantly_exec is true, callbackfn will be called instantly.
   * @param  {string}                key            [description]
   * @param  {(value: any) => void} callbackfn     [description]
   * @param  {boolean}               instantly_exec [description]
   * @return {(value: any) => void}                [description]
   */
  public setEventToProp<T>(key: string, callbackfn: (value: T) => void, instantly_exec?: boolean): (value: T) => void {
    this.on(key, callbackfn);
    if (instantly_exec && this._props[key] !== undefined) {
      callbackfn(this._props[key]);
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
    return this._props[key];
  }
}

export default NodeProps;
