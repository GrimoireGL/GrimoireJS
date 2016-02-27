import GomlTreeNodeBase from "../../GomlTreeNodeBase";
import {Action1} from "../../../Base/Delegates";
import GomlAttribute from "../../GomlAttribute";
import AttributeDeclaration from "../../AttributeDeclaration";
import BehaviorsNode from "./BehaviorsNode";

class BehaviorNode extends GomlTreeNodeBase {
  private static ignoreNode: string[] = ["name", "cachedOrder", "cachedEnabled", "children", "parent", "element"];

  /**
   * The node contains this module.
   */
  private componentTarget: GomlTreeNodeBase;

  private componentName: string;

  private cachedOrder: number = 1000;
  private cachedEnabled: boolean = undefined;
  private awakenCache: boolean = false;
  private startCalled: boolean = false;

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
    return this.componentName;
  }

  public get awaken(): boolean {
    return this.awakenCache;
  }

  public get order(): number {
    return this.cachedOrder;
  }

  public get enabled(): boolean {
    return this.cachedEnabled;
  }

  public set enabled(en: boolean) {
    this.cachedEnabled = en;
  }

  public updateBehavior(target: GomlTreeNodeBase) {
    if (!this.startCalled) {
      this.start(target);
    }
    this.updateDelegate(target);
  }

  public start(target: GomlTreeNodeBase) {
    this.startDelegate(target);
    this.startCalled = true;
  }

  public awake(target: GomlTreeNodeBase) {
    this.awakeDelegate(target);
    this.awakenCache = true;
  }


  public onEnabled(target: GomlTreeNodeBase) {
    this.onEnabledDelegate(target);
  }

  public onDisabled(target: GomlTreeNodeBase) {
    this.onDisabledDelegate(target);
  }

  protected onMount(): void {
    this.componentTarget = (<BehaviorsNode>this.parent).ComponentTarget;
    this._initializeBehavior();
  }

  private _onNameAttrChanged(attr: GomlAttribute): void {
    this.componentName = attr.Value;
    this._initializeBehavior();
  }

  private _onEnabledAttrChanged(attr: GomlAttribute): void {
    if (attr.Value === this.enabled && typeof attr.Value === "undefined") {
      this.cachedEnabled = true;
      this.onEnabled(this.componentTarget);
    }
    if (attr.Value === this.enabled) {
      return;
    }
    if (attr.Value) {
      this.onEnabled(this.componentTarget);
    } else {
      this.onDisabled(this.componentTarget);
    }
    this.enabled = attr.Value;
  }

  private _initializeBehavior(): void {
    if (this.componentName && this.componentTarget) {
      const component = this.nodeManager.behaviorRegistry.getBehavior(this.componentName);
      if (component) {
        // load d`efault value of component
        if (typeof component.order !== "undefined") {
          this.cachedOrder = component.order;
        };
        let componentEnabled;
        if (typeof component.enabled !== "undefined") {
          componentEnabled = component.enabled;
        } else {
          componentEnabled = true;
        }
        this.attributes.setValue("enabled", componentEnabled);
        if (typeof component.awake === "function") {
          this.awakeDelegate = component.awake;
        }
        if (typeof component.update === "function") {
          this.updateDelegate = component.update;
        }
        if (typeof component.start === "function") {
          this.startDelegate = component.start;
        }
        if (typeof component.onEnabled === "function") {
          this.onEnabledDelegate = component.onEnabled;
        }
        if (typeof component.onDisabled === "function") {
          this.onDisabledDelegate = component.onDisabled;
        }
        // initialize component attributes
        for (let attrKey in component.attributes) {
          const attr = component.attributes[attrKey];
          if (BehaviorNode.ignoreNode.indexOf(attrKey) !== -1 || this.attributes.isDefined(attrKey)) {// duplicated or protected attribute
            console.error(`attribute name '${attrKey}' is protected attribute name. please change name`);
            continue;
          }
          // create handler
          this.defineAccessor(attrKey);
          const attributeContainer: AttributeDeclaration = {};
          attributeContainer[attrKey] = attr;
          this.attributes.defineAttribute(attributeContainer);
        }
        this.componentTarget.addBehavior(this);
      } else {
        console.warn(`component"${this.componentName}" is not found.`);
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

  private defineAccessor(attrKey: string) {
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

  private updateDelegate: Action1<GomlTreeNodeBase> = () => { return; };
  private startDelegate: Action1<GomlTreeNodeBase> = () => { return; };
  private awakeDelegate: Action1<GomlTreeNodeBase> = () => { return; };
  private onEnabledDelegate: Action1<GomlTreeNodeBase> = () => { return; };
  private onDisabledDelegate: Action1<GomlTreeNodeBase> = () => { return; };
}

export default BehaviorNode;
