import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Delegates = require("../../../Base/Delegates");
import GomlAttribute = require("../../GomlAttribute");
import AttributeDeclaration = require("../../AttributeDeclaration");

class BehaviorNode extends GomlTreeNodeBase {
  private static ignoreNode: string[] = ["name", "cachedOrder", "cachedEnabled", "children", "parent", "element"];

  constructor() {
    super();
    this.attributes.defineAttribute({
      'name': {
        value: undefined,
        converter: 'string',
        onchanged: this._onNameAttrChanged.bind(this),
      },
      'enabled': {
        converter: 'boolean',
        value: false,
        onchanged: this._onEnabledAttrChanged.bind(this),
      },
    });
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
    if (attr.Value === this.enabled) return;
    if (attr.Value) this.onEnabled(this.componentTarget);
    else
      this.onDisabled(this.componentTarget);
    this.enabled = attr.Value;
  }

  protected nodeWillMount(parent: GomlTreeNodeBase): void {
    this.componentTarget = parent;
    this._initializeBehavior();
  }

  private _initializeBehavior(): void {
    if (this.componentName && this.componentTarget) {
      var component = this.nodeManager.behaviorRegistry.getBehavior(this.componentName);
      if (component) {
        //load d`efault value of component
        if (typeof component.order !== "undefined") this.cachedOrder = component.order;
        if (typeof component.enabled !== "undefined") var componentEnabled = component.enabled;
        else
          componentEnabled = true;
        if (typeof component.awake === "function") this.awakeDelegate = component.awake;
        if (typeof component.update === "function") this.updateDelegate = component.update;
        if (typeof component.start === "function") this.startDelegate = component.start;
        if (typeof component.onEnabled === "function") this.onEnabledDelegate = component.onEnabled;
        if (typeof component.onDisabled === "function") this.onDisabledDelegate = component.onDisabled;
        //initialize component attributes
        for (var attrKey in component.attributes) {
          var attr = component.attributes[attrKey];
          if (BehaviorNode.ignoreNode.indexOf(attrKey) !== -1 || this.attributes.isDefined(attrKey)) {//duplicated or protected attribute
            console.error(`attribute name '${attrKey}' is protected attribute name. please change name`);
            continue;
          }
          //create handler
          this.defineAccessor(attrKey);
          var attributeContainer: AttributeDeclaration = {};
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

  private defineDefaultAccessor(attr: Attr) {
    Object.defineProperty(this, attr.name, {
      get:
      () => {
        return attr.value;
      },
      set: (v) => {
        attr.value = v;
      }
    });
  }

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
  /**
   * The node contains this module.
   */
  private componentTarget: GomlTreeNodeBase;

  private componentName: string;

  public get BehaviorName(): string {
    return this.componentName;
  }
  private awakenCache: boolean = false;

  public get awaken(): boolean {
    return this.awakenCache;
  }

  private cachedOrder: number = 1000;
  public get order(): number {
    return this.cachedOrder;
  }

  private cachedEnabled: boolean = undefined;
  public get enabled(): boolean {
    return this.cachedEnabled;
  }

  public set enabled(en: boolean) {
    this.cachedEnabled = en;
  }

  private updateDelegate: Delegates.Action1<GomlTreeNodeBase> = () => { };
  public updateBehavior(target: GomlTreeNodeBase) {
    if (!this.startCalled) this.start(target);
    this.updateDelegate(target);
  }

  private startCalled: boolean = false;
  private startDelegate: Delegates.Action1<GomlTreeNodeBase> = () => { };
  public start(target: GomlTreeNodeBase) {
    this.startDelegate(target);
    this.startCalled = true;
  }

  private awakeDelegate: Delegates.Action1<GomlTreeNodeBase> = () => { };
  public awake(target: GomlTreeNodeBase) {
    this.awakeDelegate(target);
    this.awakenCache = true;
  }


  private onEnabledDelegate: Delegates.Action1<GomlTreeNodeBase> = () => { };
  public onEnabled(target: GomlTreeNodeBase) {
    this.onEnabledDelegate(target);
  }

  private onDisabledDelegate: Delegates.Action1<GomlTreeNodeBase> = () => { };
  public onDisabled(target: GomlTreeNodeBase) {
    this.onDisabledDelegate(target);
  }
}

export = BehaviorNode;
