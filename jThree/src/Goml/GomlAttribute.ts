import JThreeObjectEEWithID = require("../Base/JThreeObjectEEWithID");
import AttributeConverterBase = require("./Converter/AttributeConverterBase");
import Delegates = require("../Base/Delegates");
import GomlTreeNodeBase = require('./GomlTreeNodeBase');
import JThreeEvent = require('../Base/JThreeEvent');
/**
 * Provides the feature to manage attribute of GOML.
 */
class GomlAttribute extends JThreeObjectEEWithID
{
  /**
   * The cache value for attribute.
   */
  protected value: any;
  /**
   * Reference to converter class that will manage to parse,cast to string and animation.
   */
  protected converter: AttributeConverterBase;

  protected constant: boolean;

  constructor(name: string, value: any, converter: AttributeConverterBase, constant?: boolean)
  {
    super(name);
    if (typeof constant === "undefined") constant = false;
    this.constant = constant;
    this.converter = converter;
    this.value = converter.FromInterface(value);
  }

  public get Name(): string
  {
    return this.ID;
  }

  public get Value(): any
  {
    return this.value;
  }

  public get Constant(): boolean {
    return this.constant;
  }

  public set Value(val: any) {
    if (this.Constant) {
      console.warn(`attribute "${this.ID}" is immutable`)
      return;
    }
    this.value = this.Converter.FromInterface(val);
    this.emit('attr-changed', this);
  }

  public get Converter(): AttributeConverterBase
  {
    return this.converter;
  }

  public notifyValueChanged()
  {
    if (this.Constant) return;
    this.emit('attr-changed', this);
  }
}

export = GomlAttribute;
