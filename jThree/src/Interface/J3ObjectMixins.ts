import J3Object = require("./J3Object");
import GomlNodeMethods = require("./Miscellaneous/GomlNodeMethods");
import TreeTraversal = require("./Traversing/TreeTraversal");
import GeneralAttributes = require("./Manipulation/GeneralAttributes");

const mixins = [
  GomlNodeMethods,
  TreeTraversal,
  GeneralAttributes,
];

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

applyMixins(J3Object, mixins);
