import test from "ava";
import XMLReader from "../../src/Tool/XMLReader";
import fs from "../fileHelper";
import TestEnvManager from "../TestEnvManager";

TestEnvManager.init();

const xml = fs.readFile("../_TestResource/XMLReader_Case1.xml");

test("parseXML behaves correctly", t => {
  const parsedDocument = XMLReader.parseXML(xml);
  t.truthy(parsedDocument.localName === "goml");
  t.throws(() => {
    XMLReader.parseXML(">");
  });
});
