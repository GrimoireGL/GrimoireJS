import fs from "../fileHelper";
import test from "ava";
import TestEnvManager from "../TestEnvManager";
import XMLReader from "../../src/Tools/XMLReader";

TestEnvManager.init();

const xml = fs.readFile("../_TestResource/XMLReader_Case1.xml");

test("parseXML behaves correctly", t => {
  const parsedDocument = XMLReader.parseXML(xml);
  t.truthy(parsedDocument.localName === "goml");
  t.throws(() => {
    XMLReader.parseXML(">");
  });
});
