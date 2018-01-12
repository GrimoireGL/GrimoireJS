import test from "ava";
import StringConverter from "../../src/Converter/StringConverter";

test("StringConverter should convert collectly", t => {
  t.truthy(StringConverter.convert("HELLO", null as any) === "HELLO");
  t.truthy(StringConverter.convert(null, null as any) === null);
  t.truthy(StringConverter.convert(123, null as any) === "123");
  t.truthy(StringConverter.convert({ toString: () => "value" }, null as any) === "value");
});
