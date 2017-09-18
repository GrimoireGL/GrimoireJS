import GrimoireInterface from "../src/Core/GrimoireInterface";
import GomlLoader from "../src/Core/GomlLoader";
import xhrmock from "xhr-mock";
import xmldom from "xmldom";

import {
  goml,
  stringConverter,
  testComponent1,
  testComponent2,
  testComponent3,
  testComponentBase,
  testComponentOptional,
  testNode1,
  testNode2,
  testNode3,
  testNodeBase,
  conflictNode1,
  conflictNode2,
  conflictComponent1,
  conflictComponent2
} from "./DummyObjectRegisterer";
import Environment from "../src/Core/Environment";

declare namespace global {
  let Node: any;
  let document: any;
}

export default class PageLoadingHelper {
  public static async reset(gr: typeof GrimoireInterface, html: string): Promise<any> {
    gr.clear();
    const parser = new xmldom.DOMParser();
    const htmlDoc = parser.parseFromString(html, "text/html");

    Environment.document = htmlDoc;
    Environment.document.querySelectorAll = function() {
      return Environment.document.getElementsByTagName("script");
    };
    goml();
    testNode1();
    testNode2();
    testNode3();
    testNodeBase();
    conflictNode1();
    conflictNode2();
    const spys: any = {};
    spys.stringConverterSpy = stringConverter();
    spys.testComponent1Spy = testComponent1();
    spys.testComponent2Spy = testComponent2();
    spys.testComponent3Spy = testComponent3();
    spys.testComponentBaseSpy = testComponentBase();
    spys.testComponentOptionalSpy = testComponentOptional();
    spys.conflictComponent1Spy = conflictComponent1();
    spys.conflictComponent2Spy = conflictComponent2();
    await gr.resolvePlugins();
    await GomlLoader.loadForPage();
    return spys;
  }

  public static mockSetup(): void {
    xhrmock.setup();
  }
  public static mock(path: string, content: string): void {
    xhrmock.get(path, (req, res) => {
      let aa = res.status(200).body(content);
      return aa;
    });
  }
}
