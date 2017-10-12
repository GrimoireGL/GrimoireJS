import test from "ava";
import BooleanConverter from "../../src/Converters/BooleanConverter";

test("BooleanConverter should convert collectly", t => {
  t.truthy(BooleanConverter(true) === true);
  t.truthy(BooleanConverter(false) === false);
  t.truthy(BooleanConverter("true") === true);
  t.truthy(BooleanConverter("false") === false);

  t.truthy(BooleanConverter("aaaa") === undefined);
  t.truthy(BooleanConverter("False") === undefined);
  t.truthy(BooleanConverter("True") === undefined);
  t.truthy(BooleanConverter("") === undefined);
  t.truthy(BooleanConverter(null) === undefined);
  t.truthy(BooleanConverter(123) === undefined);
});
