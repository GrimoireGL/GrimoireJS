
/**
 * booleanのためのコンバータです。
 * booleanはそのまま通します。
 * 文字列は、`true`,`false`のみ通します。
 * @param  {any}       val  [description]
 * @param  {Attribute} attr [description]
 * @return {any}            [description]
 */
export default function BooleanConverter(val: any): any {
  if (typeof val === "boolean") {
    return val;
  } else if (typeof val === "string") {
    switch (val) {
      case "true":
        return true;
      case "false":
        return false;
    }
  }
}
