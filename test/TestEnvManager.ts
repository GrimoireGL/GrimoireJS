import "babel-polyfill";
import xhrmock from "xhr-mock";
import xmlserializer from "xmlserializer";
import Environment from "../src/Core/Environment";
import GomlLoader from "../src/Core/GomlLoader";
import GomlParser from "../src/Core/GomlParser";
import GrimoireInterface from "../src/Core/GrimoireInterface";
import Identity from "../src/Core/Identity";
import IdentityMap from "../src/Core/IdentityMap";
import IAttributeConverterDeclaration from "../src/Interface/IAttributeConverterDeclaration";
import XMLReader from "../src/Tool/XMLReader";
import jsdomAsync from "./JsDOMAsync";

export default class TestEnvManager {

  public static async init(html = "<html></html>") {
    const window = await jsdomAsync(html, []);
    Environment.DomParser = new window.DOMParser();

    Environment.document = window.document;
    Environment.Node = {
      ELEMENT_NODE: 1,
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
    const rootNode = GomlParser.parse(doc);
    GrimoireInterface.addRootNode(null, rootNode);
  }
}
