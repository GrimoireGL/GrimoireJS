import IOption from "./IOption";
import EffecterBase from "./Effecter/EffecterBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import EffecterList from "./Effecter/EffecterList";
import EasingFunctionBase from "./Easing/EasingFunctionBase";
import EasingFunctionList from "./Easing/EasingFunctionList";
import Module from "../../Module/Module";

class EffectModule<T> extends Module {
  public enabled: boolean = false;
  public afterDetach: () => void;
  public property: string;
  public option: IOption;
  private _beginTime: number;
  private _effecter: EffecterBase<T>;
  private _node: GomlTreeNodeBase;
  private _value: T;

  constructor(node: GomlTreeNodeBase, property: string, value: string, option: IOption, afterDetach?: () => void) {
    super();
    this._node = node;
    this.property = property;
    this.option = option;
    this.afterDetach = afterDetach;
    const attr = node.attributes.getAttribute(property);
    this._value = attr.Converter.toObjectAttr(value);
    const easing: EasingFunctionBase = new EasingFunctionList[option.easing]();
    function attrUpdater(val: T) {
      attr.Value = val;
    }
    this._effecter = new EffecterList[attr.Converter.name](null, option.duration, attr.Value, this._value, easing, attrUpdater, this._complete.bind(this));
  }

  public get appeared(): boolean {
    return this._effecter.appeared;
  }

  public set appeared(b: boolean) {
    this._effecter.appeared = b;
  }

  public start(node: GomlTreeNodeBase): void {
    this._beginTime = +new Date();
    this._effecter.beginTime = this._beginTime;
  }

  public update(node: GomlTreeNodeBase): void {
    this._effecter.update(+new Date());
  }

  private _complete(): void {
    this.detach();
    this.afterDetach();
  }
}

export default EffectModule;
