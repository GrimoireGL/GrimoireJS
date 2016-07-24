import test from 'ava';
import GomlParser from "../../lib-es5/Core/Node/GomlParser";
import xmldom from 'xmldom';
import DefaultPluginRegister from "../../lib-es5/Core/Node/DefaultPluginRegister"

function loadFromTestResource(path){
  return require("./_TestResource/"+path);
}

function obtainElementTag(path){
  const DOMParser = xmldom.DOMParser;
  const parser = new DOMParser();
  return parser.parseFromString(loadFromTestResource(path),"text/xml").documentElement;
}

DefaultPluginRegister.register();

test('test for parsing node hierarchy.',(t)=>{
  const element = obtainElementTag("GOMLParserTest_Case1.goml");
  const node = GomlParser.parse(element);
  t.truthy(node.parent === undefined);
  t.truthy(node.children.length === 1);
  const c = node.children[0];
  t.truthy(c.parent === node);
  t.truthy(c.children.length === 1);
  t.truthy(c.children[0].children.length === 0);
});

test('test parse for goml parser2',(t)=>{
  const element = obtainElementTag("GOMLParserTest_Case2.goml");
  const node = GomlParser.parse(element);
  t.truthy(node.parent === undefined);
  node.broadcastMessage("dummyMethod","testArgument");
});
test('test parse for goml parser2',(t)=>{
  const element = obtainElementTag("GOMLParserTest_Case2.goml");
  const node = GomlParser.parse(element);
});
