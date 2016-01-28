import J3Object from "./J3Object";
import GomlNodeMethods from "./Miscellaneous/GomlNodeMethods";
import TreeTraversal from "./Traversing/TreeTraversal";
import GeneralAttributes from "./Manipulation/GeneralAttributes";
import CollectionManipulation from "./Manipulation/CollectionManipulation";
import Utilities from "./Utilities/Utilities";

function J3ObjectMixins() {
  const mixins = [
    GomlNodeMethods,
    TreeTraversal,
    GeneralAttributes,
    CollectionManipulation,
  ];

  const staticMixins = [
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
}

export default J3ObjectMixins;
