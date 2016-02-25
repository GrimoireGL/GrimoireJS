import GomlTreeNodeBase from "../../GomlTreeNodeBase";
import {Action1} from "../../../Base/Delegates";
import GomlAttribute from "../../GomlAttribute";
import AttributeDeclaration from "../../AttributeDeclaration";
import BehaviorsNode from "./BehaviorsNode";

class BehaviorNode extends GomlTreeNodeBase {
  private static _ignoreNode: string[] = ["name", "cachedOrder", "cachedEnabled", "children", "parent", "element"];

  /**
   * The node contains this module.
   */
  private _componentTarget: GomlTreeNodeBase;

  private _componentName: string;

  private _cachedOrder: number = 1000;
  private _cachedEnabled: boolean = undefined;
  private _awakenCache: boolean = false;
  private _startCalled: boolean = false;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "name": {
        value: undefined,
        converter: "string",
        onchanged: this._onNameAttrChanged.bind(this),
      },
      "enabled": {
        value: false,
        converter: "boolean",
        onchanged: this._onEnabledAttrChanged.bind(this),
      },
    });
  }

  public get BehaviorName(): string {
    return this._componentName;
  }

  public get awaken(): boolean {
    return this._awakenCache;
  }

  public get order(): number {
    return this._cachedOrder;
  }

  public get enabled(): boolean {
    return this._cachedEnabled;
  }

  public set enabled(en: boolean) {
    this._cachedEnabled = en;
  }

  public updateBehavior(target: GomlTreeNodeBase): void {
    if (!this._startCalled) {
      this.start(target);
    }
    this._updateDelegate(target);
  }

  public start(target: GomlTreeNodeBase): void {
    this._startDelegate(target);
    this._startCalled = true;
  }

  public awake(target: GomlTreeNodeBase): void {
    this._awakeDelegate(target);
    this._awakenCache = true;
  }


  public onEnabled(target: GomlTreeNodeBase): void {
    this._onEnabledDelegate(target);
  }

  public onDisabled(target: GomlTreeNodeBase): void {
    this._onDisabledDelegate(target);
  }

  protected __onMount(): void {
    this._componentTarget = (<BehaviorsNode>this.parent).ComponentTarget;
    this._initializeBehavior();
  }

  private _onNameAttrChanged(attr: GomlAttribute): void {
    this._componentName = attr.Value;
    this._initializeBehavior();
  }

  private _onEnabledAttrChanged(attr: GomlAttribute): void {
    if (attr.Value === this.enabled && typeof attr.Value === "undefined") {
      this._cachedEnabled = true;
      this.onEnabled(this._componentTarget);
    }
    if (attr.Value === this.enabled) {
      return;
    }
    if (attr.Value) {
      this.onEnabled(this._componentTarget);
    } else {
      this.onDisabled(this._componentTarget);
    }
    this.enabled = attr.Value;
  }

  private _initializeBehavior(): void {
    if (this._componentName && this._componentTarget) {
      const component = this.nodeManager.behaviorRegistry.getBehavior(this._componentName);
      if (component) {
        // load d`efault value of component
        if (typeof component.order !== "undefined") {
          this._cachedOrder = component.order;
        };
        let componentEnabled;
        if (typeof component.enabled !== "undefined") {
          componentEnabled = component.enabled;
        } else {
          componentEnabled = true;
        }
        this.attributes.setValue("enabled", componentEnabled);
        if (typeof component.awake === "function") {
          this._awakeDelegate = component.awake;
        }
        if (typeof component.update === "function") {
          this._updateDelegate = component.update;
        }
        if (typeof component.start === "function") {
          this._startDelegate = component.start;
        }
        if (typeof component.onEnabled === "function") {
          this._onEnabledDelegate = component.onEnabled;
        }
        if (typeof component.onDisabled === "function") {
          this._onDisabledDelegate = component.onDisabled;
        }
        // initialize component attributes
        for (let attrKey in component.attributes) {
          const attr = component.attributes[attrKey];
          if (BehaviorNode._ignoreNode.indexOf(attrKey) !== -1 || this.attributes.isDefined(attrKey)) {// duplicated or protected attribute
            console.error(`attribute name '${attrKey}' is protected attribute name. please change name`);
            continue;
          }
          // create handler
          this._defineAccessor(attrKey);
          const attributeContainer: AttributeDeclaration = {};
          attributeContainer[attrKey] = attr;
          this.attributes.defineAttribute(attributeContainer);
        }
        this._componentTarget.addBehavior(this);
      } else {
        console.warn(`component"${this._componentName}" is not found.`);
      }
    } else {
      console.warn("component name was not specified");
    }
  }

  // private defineDefaultAccessor(attr: Attr) {
  //   Object.defineProperty(this, attr.name, {
  //     get:
  //     () => {
  //       return attr.value;
  //     },
  //     set: (v) => {
  //       attr.value = v;
  //     }
  //   });
  // }

  private _defineAccessor(attrKey: string): any {
    Object.defineProperty(this, attrKey, {
      get:
      () => {
        return this.attributes.getValue(attrKey);
      },
      set: (v) => {
        this.attributes.setValue(attrKey, v);
      }
    });
  }

  private _updateDelegate: Action1<GomlTreeNodeBase> = () => { return; };
  private _startDelegate: Action1<GomlTreeNodeBase> = () => { return; };
  private _awakeDelegate: Action1<GomlTreeNodeBase> = () => { return; };
  private _onEnabledDelegate: Action1<GomlTreeNodeBase> = () => { return; };
  private _onDisabledDelegate: Action1<GomlTreeNodeBase> = () => { return; };
}

export default BehaviorNode;
