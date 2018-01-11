import test from "ava";
import NumberConverter from "../../src/Converter/NumberConverter";
import TestEnvManager from "../TestEnvManager";

TestEnvManager.init();

test("NumberConverter should convert collectly", t => {
  t.truthy(NumberConverter.convert(123) === 123);
  t.truthy(NumberConverter.convert("123") === 123);
  t.truthy(NumberConverter.convert(null) === null);
  t.truthy(NumberConverter.convert([123]) === 123);
  t.truthy(NumberConverter.convert("this string can not convert to number") === undefined);
  t.truthy(NumberConverter.convert([123, 456]) === undefined);
});
