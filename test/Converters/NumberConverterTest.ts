import test from "ava";
import NumberConverter from "../../src/Converters/NumberConverter";
import TestEnvManager from "../TestEnvManager";

TestEnvManager.init();

test("NumberConverter should convert collectly", t => {
  t.truthy(NumberConverter(123) === 123);
  t.truthy(NumberConverter("123") === 123);
  t.truthy(NumberConverter(null) === null);
  t.truthy(NumberConverter([123]) === 123);
  t.truthy(NumberConverter("this string can not convert to number") === undefined);
  t.truthy(NumberConverter([123, 456]) === undefined);
});
