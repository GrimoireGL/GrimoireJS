import GrimoireInterface from "../GrimoireInterface";
import Attribute from "../Node/Attribute";

const splitter = " ";
const escape = "\\";

function ArrayConverter(val: any, attr: Attribute): any {
  if (!attr.declaration["type"]) {
    throw new Error("Array converter needs to be specified type in attribute declaration.");
  }
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

export default ArrayConverter;
