import J3Object = require("./J3Object");
import GomlNodeMethods = require("./Miscellaneous/GomlNodeMethods");
import TreeTraversal = require("./Traversing/TreeTraversal");
import GeneralAttributes = require("./Manipulation/GeneralAttributes");
import CollectionManipulation = require("./Manipulation/CollectionManipulation");
import Find = require("./Static/Find");
import Utilities = require("./Static/Utilities");

const mixins = [
  GomlNodeMethods,
  TreeTraversal,
  GeneralAttributes,
  CollectionManipulation,
];

const staticMixins = [
  Find,
  Utilities,
];

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

function applyStaticMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.keys(baseCtor).forEach((name) => {
      derivedCtor[name] = baseCtor[name];
    });
  });
}

applyMixins(J3Object, mixins);
applyStaticMixins(J3Object, staticMixins);
