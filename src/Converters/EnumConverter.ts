import Attribute from "../Core/Attribute";
/**
 * 列挙のためのコンバータ。
 * 属性宣言に`table`パラメータが必要です。
 * `table`パラメータは列挙する文字列から数値への連想配列です。
 * 数値の場合、そのまま返します。
 * 文字列の場合、テーブルの対応する値を返します。
 */
export default {
  name: "Enum",
  verify: function (attr: Attribute) {
    if (!attr.declaration["table"]) {
      throw new Error("Enum converter needs to be specified table in attribute dictionary");
    }
  },
  convert: function (val: any, attr: Attribute) {
    if (val === null) {
      return null;
    }
    if (typeof val === "number") {
      return val;
    }
    if (typeof val === "string") {
      const result = attr.declaration["table"][val];
      if (!result) {
        throw new Error("Specified value is not exisiting in the relation table");
      }
      return result;
    }
  }
};
