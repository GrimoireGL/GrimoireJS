import J3Object from "./J3Object";
import GomlNodeMethods from "./Miscellaneous/GomlNodeMethods";
import TreeTraversal from "./Traversing/TreeTraversal";
import GeneralAttributes from "./Manipulation/GeneralAttributes";
import CollectionManipulation from "./Manipulation/CollectionManipulation";
import Utilities from "./Static/Utilities";
import Find from "./Static/Find";
import Filter from "./Static/Filter";

function J3ObjectMixins() {
  const mixins = [
    GomlNodeMethods,
    TreeTraversal,
    GeneralAttributes,
    CollectionManipulation,
  ];

  const staticMixins = [
    Utilities,
    Find,
    Filter,
  ];

  function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        if (name !== "constructor") {
          const descriptor = {
            value: baseCtor.prototype[name],
            enumerable: false,
            configurable: true,
            writable: true,
          };
          Object.defineProperty(derivedCtor.prototype, name, descriptor);
        }
      });
    });
  }

  function applyStaticMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor).forEach((name) => {
        if (name !== "prototype" && name !== "name" && name !== "length" && name !== "arguments" && name !== "caller") {
          const descriptor = {
            value: baseCtor[name],
            enumerable: false,
            configurable: true,
            writable: true,
          };
          Object.defineProperty(derivedCtor, name, descriptor);
        }
      });
    });
  }

  applyMixins(J3Object, mixins);
  applyStaticMixins(J3Object, staticMixins);
}

export default J3ObjectMixins;
