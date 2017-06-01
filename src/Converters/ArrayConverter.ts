import GrimoireInterface from "../Interface/GrimoireInterface";
import Attribute from "../Node/Attribute";

const splitter = " ";
const escape = "\\";

/**
 * 配列のためのコンバータ。
 * 属性宣言にパラメータ`type`が必要です。
 * このパラメータは配列の要素の型のためのコンバータ名です。
 * このコンバータは、配列が与えられたらその内容すべてを、`type`で指定されたコンバータを通して生成した新しい配列を返します。
 * 文字列が与えられたとき、*半角スペース*で区切られた文字列ごとに配列に分割して同様の処理を行います。
 * ただし、`\`(バックスラッシュ)で*半角スペースをエスケープできます*
 */
export default {
  name: "Array",
  verify: function(attr: Attribute) {
    if (!attr.declaration["type"]) {
      throw new Error("Array converter needs to be specified type in attribute declaration.");
    }
  },
  convert: function(val: any, attr: Attribute) {
    let converter = GrimoireInterface.converters.get(attr.declaration["type"]);
    if (!converter) {
      throw new Error(`converter ${attr.declaration["type"]} is not registerd.`);
    }
    if (Array.isArray(val)) {
      return val.map(v => converter.convert(v, attr));
    }
    if (typeof val === "string") {
      let ar = val.split(splitter);
      for (let i = 0; i < ar.length; i++) {
        let s = ar[i];
        if (s[s.length - 1] === escape) {
          if (i === ar.length - 1) {
            ar[i] = s.substring(0, s.length - escape.length) + splitter;
          } else {
            ar[i] = s.substring(0, s.length - escape.length) + splitter + ar[i + 1];
            ar.splice(i + 1, 1);
          }
        }
      }

      return ar.map(v => converter.convert(v, attr));
    }
    return null;
  }
};
