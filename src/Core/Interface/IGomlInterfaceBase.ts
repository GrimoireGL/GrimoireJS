import Component from "../Node/Component";
interface IGomlInterfaceBase {
  get<T>(): T;
  get<T>(componentIndex: number): T;
  get<T>(nodeIndex: number, componentIndex: number): T;
  get<T>(treeIndex: number, nodeIndex: number, componentIndex: number): T;
  forEach(f: (v: Component, compIndex: number, nodeIndex: number, treeIndex: number) => void);
}

export default IGomlInterfaceBase;
