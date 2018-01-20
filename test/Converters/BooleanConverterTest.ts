import test from "ava";
import BooleanConverter from "../../src/Converter/BooleanConverter";

test("BooleanConverter should convert collectly", t => {
  t.truthy(BooleanConverter.convert(true, null!, null!) === true);
  t.truthy(BooleanConverter.convert(false, null as any, null as any) === false);
  t.truthy(BooleanConverter.convert("true", null as any, null as any) === true);
  t.truthy(BooleanConverter.convert("false", null as any, null as any) === false);

  t.truthy(BooleanConverter.convert("aaaa", null as any, null as any) === undefined);
  t.truthy(BooleanConverter.convert("False", null as any, null as any) === undefined);
  t.truthy(BooleanConverter.convert("True", null as any, null as any) === undefined);
  t.truthy(BooleanConverter.convert("", null as any, null as any) === undefined);
  t.truthy(BooleanConverter.convert(null, null as any, null as any) === undefined);
  t.truthy(BooleanConverter.convert(123, null as any, null as any) === undefined);
});
