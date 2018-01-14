import BooleanConverter from "../Converter/BooleanConverter";
import StringConverter from "../Converter/StringConverter";
import Component from "../Core/Component";
import GomlNode from "../Core/GomlNode";
import GomlParser from "../Core/GomlParser";
import { IAttributeConverterDeclaration, IConverterDeclaration } from "../Interface/IAttributeConverterDeclaration";
import XMLHttpRequestAsync from "../Tool/XMLHttpRequestAsync";
import XMLReader from "../Tool/XMLReader";

export { IConverterDeclaration, IAttributeConverterDeclaration };

/**
 * template component
 * This component is intended to treat the structured node structure as a single node.
 */
export default class TemplateComponent extends Component {
  /**
   * name
   */
  public static componentName = "Template";
  /**
   * attributes
   */
  public static attributes = {
    /**
     * this attribute is expanded as child element on inflate() is called.
     */
    goml: {
      converter: StringConverter,
      default: null,
    },
    src: {
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
  public async inflate() {
    const src = this.getAttribute(TemplateComponent.attributes.src);
    if (src) {
      const req = new XMLHttpRequest();
      req.open("GET", src);
      await XMLHttpRequestAsync.send(req);
      this.setAttribute(TemplateComponent.attributes.goml, req.responseText);
    }
    const goml = this.getAttribute(TemplateComponent.attributes.goml);
    if (goml) {
      const doc = XMLReader.parseXML(goml);
      const node = GomlParser.parse(doc);
      this.node.addChild(node);
    }
  }

  protected async $awake() {
    if (this.getAttribute(TemplateComponent.attributes.auto)) {
      await this.inflate();
    }
  }
}
