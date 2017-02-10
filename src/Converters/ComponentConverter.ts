import Ensure from "../Base/Ensure";
import Component from "../Node/Component";
import GomlNode from "../Node/GomlNode";
import Attribute from "../Node/Attribute";


/**
 * コンポーネントのためのコンバータです。
 * 属性宣言に`target`パラメータの指定が必要です。
 * nullに対してはnullを返します。
 * `gomlnode`に対しては、`target`パラメータの値で`getComponent`した結果を返します。
 * `Component`に対しては、`target`パラメータと型が一致していればそのまま返します。そうでなければ、例外を投げます。
 * 文字列の場合、ノードに対するクエリとして解釈され、取得されたノードに対して`getComponent`されます。
 */
export default {
  name: "Component",
  verify: function(attr: Attribute) {
    if (!attr.declaration["target"]) {
      throw new Error("Component converter require to be specified target");
    }
  },
  convert: function(val: any, attr: Attribute) {
    if (val === null) {
      return null;
    }
    if (val instanceof GomlNode) {
      return val.getComponent(attr.declaration["target"]);
    } else if (val instanceof Component) {
      if (val.name.fqn === Ensure.tobeNSIdentity(attr.declaration["target"]).fqn) {
        return val;
      } else {
        throw new Error(`Specified component must be ${attr.declaration["target"]}`);
      }
    } else {
      const n = attr.tree(val).first();
      if (n) {
        return n.getComponent(attr.declaration["target"]);
      }
      return null;
    }
  }
};
