import GomlTreeNodeBase from "../../GomlTreeNodeBase";
class BehaviorNode extends GomlTreeNodeBase {
    constructor() {
        super();
        this._cachedOrder = 1000;
        this._cachedEnabled = undefined;
        this._awakenCache = false;
        this._startCalled = false;
        this._updateDelegate = () => { return; };
        this._startDelegate = () => { return; };
        this._awakeDelegate = () => { return; };
        this._onEnabledDelegate = () => { return; };
        this._onDisabledDelegate = () => { return; };
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
    get BehaviorName() {
        return this._componentName;
    }
    get awaken() {
        return this._awakenCache;
    }
    get order() {
        return this._cachedOrder;
    }
    get enabled() {
        return this._cachedEnabled;
    }
    set enabled(en) {
        this._cachedEnabled = en;
    }
    updateBehavior(target) {
        if (!this._startCalled) {
            this.start(target);
        }
        this._updateDelegate(target);
    }
    start(target) {
        this._startDelegate(target);
        this._startCalled = true;
    }
    awake(target) {
        this._awakeDelegate(target);
        this._awakenCache = true;
    }
    onEnabled(target) {
        this._onEnabledDelegate(target);
    }
    onDisabled(target) {
        this._onDisabledDelegate(target);
    }
    __onMount() {
        this._componentTarget = this.__parent.ComponentTarget;
        this._initializeBehavior();
    }
    _onNameAttrChanged(attr) {
        this._componentName = attr.Value;
        this._initializeBehavior();
    }
    _onEnabledAttrChanged(attr) {
        if (attr.Value === this.enabled && typeof attr.Value === "undefined") {
            this._cachedEnabled = true;
            this.onEnabled(this._componentTarget);
        }
        if (attr.Value === this.enabled) {
            return;
        }
        if (attr.Value) {
            this.onEnabled(this._componentTarget);
        }
        else {
            this.onDisabled(this._componentTarget);
        }
        this.enabled = attr.Value;
    }
    _initializeBehavior() {
        if (this._componentName && this._componentTarget) {
            const component = this.nodeManager.behaviorRegistry.getBehavior(this._componentName);
            if (component) {
                // load d`efault value of component
                if (typeof component.order !== "undefined") {
                    this._cachedOrder = component.order;
                }
                ;
                let componentEnabled;
                if (typeof component.enabled !== "undefined") {
                    componentEnabled = component.enabled;
                }
                else {
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
                    if (BehaviorNode._ignoreNode.indexOf(attrKey) !== -1 || this.attributes.isDefined(attrKey)) {
                        console.error(`attribute name '${attrKey}' is protected attribute name. please change name`);
                        continue;
                    }
                    // create handler
                    this._defineAccessor(attrKey);
                    const attributeContainer = {};
                    attributeContainer[attrKey] = attr;
                    this.attributes.defineAttribute(attributeContainer);
                }
                this._componentTarget.addBehavior(this);
            }
            else {
                console.warn(`component"${this._componentName}" is not found.`);
            }
        }
        else {
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
    _defineAccessor(attrKey) {
        Object.defineProperty(this, attrKey, {
            get: () => {
                return this.attributes.getValue(attrKey);
            },
            set: (v) => {
                this.attributes.setValue(attrKey, v);
            }
        });
    }
}
BehaviorNode._ignoreNode = ["name", "cachedOrder", "cachedEnabled", "children", "parent", "element"];
export default BehaviorNode;
