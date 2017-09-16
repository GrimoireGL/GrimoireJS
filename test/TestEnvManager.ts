import XMLReader from "../src/Tools/XMLReader";
import xmldom from "xmldom";
import Attribute from "../src/Core/Attribute";
import IAttributeConverterDeclaration from "../src/Interface/IAttributeConverterDeclaration";
import IConverterRepository from "../src/Interface/Repository/IConverterRepository";
import NSDictionary from "../src/Tools/NSDictionary";
import NSIdentity from "../src/Core/NSIdentity";

class TestEnvContext implements IConverterRepository {
  public converters: NSDictionary<IAttributeConverterDeclaration>;

}

export default class TestEnvManager {
  public static context = new TestEnvContext();
  public static addConverter(name: NSIdentity, converter: IAttributeConverterDeclaration) {
    this.context.converters.set(name, converter);
  }

  public static init() {
    XMLReader.parser = new xmldom.DOMParser();
    // Attribute.converterRepository = TestEnvManager.context;
  }
}
