import '../XMLDomInit'
import test from 'ava';
import Utility from '../../lib-es5/Base/Utility';

test("isCamelCase works correctly.", t => {
  t.truthy(Utility.isCamelCase("NameName123"));
  t.truthy(Utility.isCamelCase("N"));
  t.truthy(!Utility.isCamelCase("nameName"));
  t.truthy(!Utility.isCamelCase("Name_Name"));
  t.truthy(!Utility.isCamelCase("1nameName"));
});

test("isSnakeCase works correctly.", t => {
  t.truthy(Utility.isSnakeCase("name-name-123"));
  t.truthy(Utility.isSnakeCase("nm"));
  t.truthy(Utility.isSnakeCase("--"));
  t.truthy(!Utility.isSnakeCase("nameName"));
  t.truthy(!Utility.isSnakeCase("Name_Name"));
  t.truthy(!Utility.isSnakeCase("1nameName"));
});
