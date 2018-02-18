import test from "ava";
import * as Utility from "../../src/Tool/Utility";

test("isCamelCase works correctly.", t => {
  t.truthy(Utility.isCamelCase("NameName123"));
  t.truthy(Utility.isCamelCase("N"));
  t.truthy(!Utility.isCamelCase("nameName"));
  t.truthy(!Utility.isCamelCase("Name_Name"));
  t.truthy(!Utility.isCamelCase("1nameName"));
});

test("isSnakeCase works correctly.", t => {
  t.truthy(Utility.isKebabCase("name-name-123"));
  t.truthy(Utility.isKebabCase("nm"));
  t.truthy(Utility.isKebabCase("--"));
  t.truthy(!Utility.isKebabCase("nameName"));
  t.truthy(!Utility.isKebabCase("Name_Name"));
  t.truthy(!Utility.isKebabCase("1nameName"));
});
