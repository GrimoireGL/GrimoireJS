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

declare namespace global {
  let Node: any;
  let document: any;
}

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
    const testcase1_html = fs.readFile("../_TestResource/GomlLoaderTest_Case1.html");
    const window = await jsdomAsync(testcase1_html, []);
    Environment.document = window.document;
    Environment.Node = {
      ELEMENT_NODE: 1
    };
  }

  public static async loadPage(html: string) {
    const window = await jsdomAsync(html, []);
    Environment.document = window.document;
    await GomlLoader.loadForPage();
  }
}
