import Environment from "../src/Core/Environment";
import GomlLoader from "../src/Core/GomlLoader";
import GomlParser from "../src/Core/GomlParser";
import GrimoireInterface from "../src/Core/GrimoireInterface";
import IAttributeConverterDeclaration from "../src/Interface/IAttributeConverterDeclaration";
import IConverterRepository from "../src/Interface/Repository/IConverterRepository";
import jsdomAsync from "./JsDOMAsync";
import NSDictionary from "../src/Tools/NSDictionary";
import NSIdentity from "../src/Core/NSIdentity";
import xhrmock from "xhr-mock";
import xmldom from "xmldom";
import XMLReader from "../src/Tools/XMLReader";
import xmlserializer from "xmlserializer";
import "babel-polyfill";




class TestEnvContext implements IConverterRepository {
  public converters: NSDictionary<IAttributeConverterDeclaration>;

}

export default class TestEnvManager {
  public static context = new TestEnvContext();
  public static addConverter(name: NSIdentity, converter: IAttributeConverterDeclaration) {
    this.context.converters.set(name, converter);
  }

  public static async init() {
    const window = await jsdomAsync("<html></html>", []);
    Environment.DomParser = new window.DOMParser();

    Environment.document = window.document;
    Environment.Node = {
      ELEMENT_NODE: 1
    };
    Environment.XMLSerializer = xmlserializer;
  }

  public static mockSetup(): void {
    xhrmock.setup();
  }
  public static mock(path: string, content: string): void {
    xhrmock.get(path, (req, res) => {
      return res.status(200).body(content);
    });
  }


  public static async loadPage(html: string) {
    const window = await jsdomAsync(html, []);
    Environment.document = window.document;
    await GomlLoader.loadForPage();
  }

  public static loadGoml(goml: string) {
    const doc = XMLReader.parseXML(goml);
    const rootNode = GomlParser.parse(doc[0]);
    GrimoireInterface.addRootNode(null, rootNode);
  }
}
