import BooleanConverter from "../Converter/BooleanConverter";
import StringConverter from "../Converter/StringConverter";
import Component from "../Core/Component";
import GomlNode from "../Core/GomlNode";
import GomlParser from "../Core/GomlParser";
import IAttributeConverterDeclaration from "../Interface/IAttributeConverterDeclaration";
import XMLReader from "../Tool/XMLReader";

export { IAttributeConverterDeclaration };

/**
 * template component
 * TODO add document
 */
export default class TemplateComponent extends Component { // TODO test
  /**
   * name
   */
  public static componentName = "Template";
  /**
   * attributes
   */
  public static attributes = {
    goml: {
      converter: StringConverter,
      default: null,
    },
    auto: {
      converter: BooleanConverter,
      default: true,
    },
  };

  /**
   * clone node structure.
   */
  public clone(node: GomlNode) {
    throw new Error("not implement" + node.toString());
  }

  /**
   * replace self with goml
   */
  public inflate() {
    const goml = this.getAttribute(TemplateComponent.attributes.goml);
    if (goml) {
      const doc = XMLReader.parseXML(goml);
      const node = GomlParser.parse(doc);
      this.node.addChild(node);
    }
  }

  protected $awake() {
    if (this.getAttribute(TemplateComponent.attributes.auto)) {
      this.inflate();
    }
  }
}
