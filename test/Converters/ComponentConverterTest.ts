import test from "ava";

import ComponentConverter from "../../src/Converters/ComponentConverter";

test("verify works correctly", t => {
  t.notThrows(() => {
    ComponentConverter.verify({
      declaration: {
        target: "hoge"
      }
    } as any);
  });
  t.throws(() => {
    ComponentConverter.verify({} as any);
  });
});

test("ComponentConverter should convert collectly", t => {
  // TODO add test
  t.truthy(true);
});
