import test from "ava";
import BooleanConverter from "../../src/Converters/BooleanConverter";

test("BooleanConverter should convert collectly", t => {
  t.truthy(BooleanConverter(true) === true);
  t.truthy(BooleanConverter(false) === false);
  t.truthy(BooleanConverter("true") === true);
  t.truthy(BooleanConverter("false") === false);

  t.truthy(BooleanConverter("aaaa") === void 0);
  t.truthy(BooleanConverter("False") === void 0);
  t.truthy(BooleanConverter("True") === void 0);
  t.truthy(BooleanConverter("") === void 0);
  t.truthy(BooleanConverter(null) === void 0);
  t.truthy(BooleanConverter(123) === void 0);
});
