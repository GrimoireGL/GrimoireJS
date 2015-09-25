import JThreeObjectWithID = require("../Base/JThreeObjectWithID");
import AttributeConverterBase = require("./Converter/AttributeConverterBase");
import Delegates = require("../Base/Delegates");
import GomlTreeNodeBase = require('./GomlTreeNodeBase');
import JThreeEvent = require('../Base/JThreeEvent');
/**
 * Provides the feature to manage attribute of GOML.
 */
class GomlAttribute extends JThreeObjectWithID
{
    /**
     * Reference to HTMLElement that whose attribute is managed by this class.
     */
    protected element: HTMLElement;
    /**
     * Whether this attribute was cached already or not.
     */
    protected cached: boolean = false;
    /**
     * The cache value for attribute.
     * If this.cached was false, this value can be undefined.
     */
    protected value: any = undefined;
    /**
     * Reference to converter class that will manage to parse,cast to string and animation.
     */
    protected converter: AttributeConverterBase;
    /**
     * Event managing class reference for the event that will fire when attribute value was changed.
     */
    protected onchangedHandlers: JThreeEvent<GomlAttribute> = new JThreeEvent<GomlAttribute>();
    /**
     * Reference to GomlTreeNodeBase that contains this attribute.
     */
    protected managedClass: GomlTreeNodeBase;
    /**
     * Whether it is need or not when update.
     */
    private needNotifyUpdate: boolean = true;

    protected constant:boolean;

    public get NeedNotifyUpdate()
    {
        return this.needNotifyUpdate;
    }

    public set NeedNotifyUpdate(val: boolean)
    {
        this.needNotifyUpdate = val;
    }

    constructor(node: GomlTreeNodeBase, element: HTMLElement, name: string, value: any, converter: AttributeConverterBase, handler?: Delegates.Action1<GomlAttribute>,constant?:boolean)
    {
        super(name);
        if (typeof constant === "undefined") constant = false;
        this.constant = constant;
        this.element = element;
        this.converter = converter;
        this.value = converter.FromInterface(value);
        this.managedClass = node;
        if (handler) this.onchangedHandlers.addListener(handler);
    }

    public get Name(): string
    {
        return this.ID;
    }

    public get Value(): any
    {
        if (this.cached)
        {
            return this.value;
        } else
        {
            var attr = this.element.getAttribute(this.Name);
            if (attr)
            {//if attribute was specified, cache this attribute.
                this.value = this.Converter.FromAttribute(this.element.getAttribute(this.Name));
                this.cached = true;
            }//if attribute was not specified, it will return default value of this attribute.
            return this.value;
        }
    }

    public get Constant(): boolean {
        return this.constant;
    }

    public set Value(val: any) {
        if (this.Constant)return;
        this.value = this.Converter.FromInterface(val);
        this.element.setAttribute(this.Name, this.Converter.ToAttribute(val));
        this.cached = true;
        if (this.NeedNotifyUpdate) this.notifyValueChanged();
    }

    public get Converter(): AttributeConverterBase
    {
        return this.converter;
    }

    public notifyValueChanged()
    {
        if (this.Constant) return;
        this.onchangedHandlers.fire(this, this);
    }

    public onValueChanged(handler: Delegates.Action1<GomlAttribute>)
    {
        this.onchangedHandlers.addListener(handler);
    }
}

export =GomlAttribute;
