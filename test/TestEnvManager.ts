require("babel-polyfill");
import XMLReader from "../src/Tools/XMLReader";
import xmldom from "xmldom";
import jsdomAsync from "./JsDOMAsync";
import Attribute from "../src/Core/Attribute";
import IAttributeConverterDeclaration from "../src/Interface/IAttributeConverterDeclaration";
import IConverterRepository from "../src/Interface/Repository/IConverterRepository";
import NSDictionary from "../src/Tools/NSDictionary";
import NSIdentity from "../src/Core/NSIdentity";
import fs from "./fileHelper";
import GomlLoader from "../src/Core/GomlLoader";
import GrimoireInterface from "../src/Core/GrimoireInterface";
import Environment from "../src/Core/Environment";
import xhrmock from "xhr-mock";

class TestEnvContext implements IConverterRepository {
  public converters: NSDictionary<IAttributeConverterDeclaration>;

}

export default class TestEnvManager {
  public static context = new TestEnvContext();
  public static addConverter(name: NSIdentity, converter: IAttributeConverterDeclaration) {
    this.context.converters.set(name, converter);
  }

  public static async init() {
    Environment.DomParser = new xmldom.DOMParser();
    // global.document = new xmldom.DOMParser().parseFromString("<html></html>", "text/html");
    const window = await jsdomAsync("<html></html>", []);
    Environment.document = window.document;
    Environment.Node = {
      ELEMENT_NODE: 1
    };
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
    const parser = new xmldom.DOMParser();
    const htmlDoc = parser.parseFromString(html, "text/html");

    Environment.document = htmlDoc;
    Environment.document.querySelectorAll = function () {
      return Environment.document.getElementsByTagName("script");
    };
    await GomlLoader.loadForPage();
  }
}
