import fs from "../fileHelper";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import test from "ava";
import TestEnvManager from "../TestEnvManager";



TestEnvManager.init();
const example_html = fs.readFile("../_TestResource/Example_01.html");

test.beforeEach(async () => {
  GrimoireInterface.clear();
  GrimoireInterface.registerNode("goml");
  await TestEnvManager.loadPage(example_html);
});

test("rootNodes works correctly", (t) => {
  // t.truthy(true);
  let gomlInterface = GrimoireInterface("*");
  t.truthy(gomlInterface.rootNodes.length === 3, "all nodes should be retrieved");

  gomlInterface = GrimoireInterface("#first");
  t.truthy(gomlInterface.rootNodes.length === 1, "parent node should be retrieved");

  gomlInterface = GrimoireInterface(".child");
  t.truthy(gomlInterface.rootNodes.length === 0, "all child nodes should be retrieved");
});
