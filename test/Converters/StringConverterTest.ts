import test from "ava";
import StringConverter from "../../src/Converters/StringConverter";

test("StringConverter should convert collectly", t => {
  t.truthy(StringConverter("HELLO") === "HELLO");
});
