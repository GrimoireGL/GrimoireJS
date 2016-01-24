import J3Object = require("./J3Object");
import GomlNodeMethods = require("./Miscellaneous/GomlNodeMethods");
import TreeTraversal = require("./Traversing/TreeTraversal");

const mixins = [
  GomlNodeMethods,
  TreeTraversal,
];

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

applyMixins(J3Object, mixins);
