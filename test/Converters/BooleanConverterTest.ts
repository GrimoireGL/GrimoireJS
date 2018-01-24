import test from "ava";
import BooleanConverter from "../../src/Converter/BooleanConverter";

test("BooleanConverter should convert collectly", t => {
  t.truthy(BooleanConverter.convert(true) === true);
  t.truthy(BooleanConverter.convert(false) === false);
  t.truthy(BooleanConverter.convert("true") === true);
  t.truthy(BooleanConverter.convert("false") === false);

  t.truthy(BooleanConverter.convert("aaaa") === undefined);
  t.truthy(BooleanConverter.convert("False") === undefined);
  t.truthy(BooleanConverter.convert("True") === undefined);
  t.truthy(BooleanConverter.convert("") === undefined);
  t.truthy(BooleanConverter.convert(null) === undefined);
  t.truthy(BooleanConverter.convert(123) === undefined);
});
