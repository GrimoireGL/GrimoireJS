import test from 'ava';
import GomlParser from "../../lib-es5/Core/Node/GomlParser";
import xmldom from 'xmldom';

function loadFromTestResource(path){
  return require("./_TestResource/"+path);
}

function obtainElementTag(path){
  const DOMParser = xmldom.DOMParser;
  const parser = new DOMParser();
  return parser.parseFromString(loadFromTestResource(path),"text/xml").documentElement;
}

test('test parse for goml parser',(t)=>{
  const element = obtainElementTag("GOMLParserTest_Case1.goml");
  console.log(element);
});
