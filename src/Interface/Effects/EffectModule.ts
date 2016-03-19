import IOption from "./IOption";
import IModule from "../../Module/IModule";
import EffecterBase from "./Effecter/EffecterBase";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import EffecterList from "./Effecter/EffecterList";
import EasingFunctionBase from "./Easing/EasingFunctionBase";
import EasingFunctionList from "./Easing/EasingFunctionList";

class Module implements IModule {
  public detach: {
    (): void;
  };
}

class EffectModule extends Module {
  public enabled: boolean = false;
  private _beginTime: number;
  private _effecters: EffecterBase[] = [];
  private _option: IOption = {};
  private _node: GomlTreeNodeBase;

  constructor(node: GomlTreeNodeBase, properties: {[key: string]: string}, option: IOption) {
    super();
    this._option = option;
    this._node = node;
    Object.keys(properties).forEach((attrName) => {
      const attr = node.attributes.getAttribute(attrName);
      const easing: EasingFunctionBase = new EasingFunctionList[option.easing]();
      const effecter: EffecterBase = new EffecterList[attr.Converter.name](attr, null, option.duration, attr.Value, properties[attrName], easing, this.complete.bind(this));
      this._effecters.push(effecter);
    });
  }

  public start(node: GomlTreeNodeBase): void {
    this._beginTime = +new Date();
    this._effecters.forEach((effecter) => {
      effecter.beginTime = this._beginTime;
    });
  }

  public update(node: GomlTreeNodeBase): void {
    this._effecters.forEach((effecter) => {
      effecter.update(+new Date());
    });
  }

  public complete(): void {
    this.detach();
    this._option.complete.call(this._node, this._node);
  }
}

export default EffectModule;
