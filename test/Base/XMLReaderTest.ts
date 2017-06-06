import "../XMLDomInit";
import test from "ava";
import xmldom from "xmldom";
import XMLReader from "../../src/Base/XMLReader";
import {readFileAsync} from "../FileHelper";

test("parseXML behaves correctly", async t => {
  const parsedDocument = XMLReader.parseXML(await readFileAsync("../../Base/_TestResource/XMLReader_Case1.xml"), "Goml");
  t.truthy(parsedDocument[0].localName === "goml");
  t.throws(() => {
    XMLReader.parseXML(">", "Goml");
  });
});
