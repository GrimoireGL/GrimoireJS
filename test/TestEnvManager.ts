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
    XMLReader.parser = new xmldom.DOMParser();
    // Attribute.converterRepository = TestEnvManager.context;
    const testcase1_html = fs.readFile("../_TestResource/GomlLoaderTest_Case1.html");
    const window = await jsdomAsync(testcase1_html, []);
    global.document = window.document;
    global.Node = {
      ELEMENT_NODE: 1
    };
  }
}
