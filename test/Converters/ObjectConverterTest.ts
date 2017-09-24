import test from "ava";
import ObjectConverter from "../../src/Converters/ObjectConverter";

test("ObjectConverter should convert collectly", t => {
  t.truthy(ObjectConverter("HELLO") === "HELLO");
  t.truthy(ObjectConverter(null) === null);
  t.truthy(ObjectConverter(123) === 123);
});
