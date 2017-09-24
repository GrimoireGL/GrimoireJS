import test from "ava";

import EnumConverter from "../../src/Converters/EnumConverter";

const mockAttrDec = {
  declaration: {
    coverter: "Enum",
    default: "Hoge",
    table: {
      "first": 1,
      "second": 2,
      "third": 3
    }
  }
} as any;

const invalidMockAttrDec = {
  declaration: {
    coverter: "Enum",
    default: "Hoge"
  }
} as any;

test("verify works correctly", t => {
  t.notThrows(() => {
    EnumConverter.verify(mockAttrDec);
  });
  t.throws(() => {
    EnumConverter.verify(invalidMockAttrDec);
  });
});

test("EnumConverter should convert collectly", t => {
  t.truthy(EnumConverter.convert("first", mockAttrDec) === 1);
  t.truthy(EnumConverter.convert("second", mockAttrDec) === 2);
  t.truthy(EnumConverter.convert("third", mockAttrDec) === 3);
  t.truthy(EnumConverter.convert(1, mockAttrDec) === 1);
  t.truthy(EnumConverter.convert(2, mockAttrDec) === 2);
  t.truthy(EnumConverter.convert(3, mockAttrDec) === 3);
  t.truthy(EnumConverter.convert(4, mockAttrDec) === 4);
  t.truthy(EnumConverter.convert(null, mockAttrDec) === null);
  t.truthy(EnumConverter.convert({}, mockAttrDec) === void 0);
  t.truthy(EnumConverter.convert(false, mockAttrDec) === void 0);

  t.throws(() => {
    EnumConverter.convert("false", mockAttrDec);
  });
  t.throws(() => {
    EnumConverter.convert("", mockAttrDec);
  });
});
