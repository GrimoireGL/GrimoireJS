import test from "ava";
import ObjectConverter from "../../src/Converter/ObjectConverter";

test("ObjectConverter should convert collectly", t => {
  t.truthy(ObjectConverter.convert("HELLO") === "HELLO");
  t.truthy(ObjectConverter.convert(null) === null);
  t.truthy(ObjectConverter.convert(123) === 123);
});
