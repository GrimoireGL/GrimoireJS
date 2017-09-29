import NumberConverter from "../../src/Converters/NumberConverter";
import test from "ava";
import TestEnvManager from "../TestEnvManager";



TestEnvManager.init();

test("NumberConverter should convert collectly", t => {
  t.truthy(NumberConverter(123) === 123);
  t.truthy(NumberConverter("123") === 123);
  t.truthy(NumberConverter(null) === null);
  t.truthy(NumberConverter([123]) === 123);
  t.truthy(NumberConverter("this string can not convert to number") === void 0);
  t.truthy(NumberConverter([123, 456]) === void 0);
});
