import GrimoireInterface from "../GrimoireInterface";
import Attribute from "../Node/Attribute";

const splitter = " ";
const escape = "\\";

function ArrayConverter(this: Attribute, val: any): any {
  if (!this.declaration["type"]) {
    throw new Error("Array converter needs to be specified type in attribute declaration.");
  }
  let converter = GrimoireInterface.converters.get(this.declaration["type"]);
  if (!converter) {
    throw new Error(`converter ${this.declaration["type"]} is not registerd.`);
  }
  const c = converter.convert.bind(this);
  if (Array.isArray(val)) {
    return val.map(v => c(v));
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

    return ar.map(v => c(v));
  }
  return null;
}

export default ArrayConverter;
