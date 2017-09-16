import test from "ava";
import xmldom from "xmldom";
import XMLReader from "../../src/Tools/XMLReader";
import fs from "../fileHelper";
import TestEnvManager from "../TestEnvManager";

TestEnvManager.init();

const xml = fs.readFile("../_TestResource/XMLReader_Case1.xml");

test("parseXML behaves correctly", t => {
  const parsedDocument = XMLReader.parseXML(xml, "Goml");
  t.truthy(parsedDocument[0].localName === "goml");
  t.throws(() => {
    XMLReader.parseXML(">", "Goml");
  });
});
