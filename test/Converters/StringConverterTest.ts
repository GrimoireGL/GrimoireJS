import test from "ava";
import StringConverter from "../../src/Converters/StringConverter";

test("StringConverter should convert collectly", t => {
  t.truthy(StringConverter.convert("HELLO") === "HELLO");
  t.truthy(StringConverter.convert(null) === null);
  t.truthy(StringConverter.convert(123) === "123");
  t.truthy(StringConverter.convert({ toString: () => "value" }) === "value");
});
