import Attribute from "../Node/Attribute";
import IComponentInterface from "./IComponentInterface";
import Component from "../Node/Component";

class ComponentInterface implements IComponentInterface {
  constructor(public components: Component[][][]) {

  }

  public get<T extends Component>(): T;
  public get<T extends Component>(componentIndex: number): T;
  public get<T extends Component>(nodeIndex: number, componentIndex: number): T;
  public get<T extends Component>(treeIndex: number, nodeIndex: number, componentIndex: number): T;
  public get<T extends Component>(i1?: number, i2?: number, i3?: number): T {
    const c = this.components;
    if (i1 === void 0) {
      if (c.length === 0 || c[0].length === 0 || c[0][0].length === 0) {
        return null;
      } else if (c.length === 1 && c[0].length === 1 || c[0][0].length === 1) {
        return c[0][0][0] as T;
      }
      throw new Error("There are too many candidate");
    } else if (i2 === void 0) {
      if (c.length === 0 || c[0].length === 0 || c[0][0].length <= i1) {
        return null;
      } else if (c.length === 1 && c[0].length === 1) {
        return c[0][0][i1] as T;
      }
      throw new Error("There are too many candidate");
    } else if (i3 === void 0) {
      if (c.length === 0 || c[0].length <= i2 || c[0][i2].length <= i1) {
        return null;
      } else if (c.length === 1) {
        return c[0][i2][i1] as T;
      }
      throw new Error("There are too many candidate");
    } else {
      if (c.length <= i3 || c[i3].length <= i2 || c[i3][i2].length <= i1) {
        return null;
      }
      return c[i3][i2][i1] as T;
    }
  }

  public forEach(f: (v: Component, compIndex: number, nodeIndex: number, treeIndex: number) => void): ComponentInterface {
    this.components.forEach((tree, ti) => {
      tree.forEach((nodes, ni) => {
        nodes.forEach((comp, ci) => {
          f(comp, ci, ni, ti);
        });
      });
    });
    return this;
  }

  public first(pred: (component: Component, gomlIndex: number, nodeIndex: number, componentIndex: number) => boolean): Component;
  public first(): Component;
  public first(pred?: (component: Component, gomlIndex: number, nodeIndex: number, componentIndex: number) => boolean): Component {
    if (!pred) {
      return this.first(() => true);
    }
    for (let i = 0; i < this.components.length; i++) {
      let array1 = this.components[i];
      for (let j = 0; j < array1.length; i++) {
        let array2 = array1[j];
        for (let k = 0; k < array2.length; k++) {
          let c = array2[k];
          if (pred(c, i, j, k)) {
            return c;
          }
        }
      }
    }
    return null;
  }

  public isEmpty(): boolean {
    let _isEmpty = true;
    this.forEach(component => {
      _isEmpty = false;
    });
    return _isEmpty;
  }

  public getAttribute(attrName: string): any {
    if (this.isEmpty()) {
      throw new Error("component interface is empty.");
    }
    return this.components[0][0][0].getValue(attrName);
  }
  public setAttribute(attrName: string, value: any): void {
    this.forEach((component) => {
      component.setValue(attrName, value);
    });
  }

  public attr(attrName: string): Attribute;
  public attr(attrName: string, value: any): void;
  public attr(attrName: string, value?: any): Attribute | void {
    if (value === void 0) {
      console.warn("attr is obsolate. please use getAttribute instead of.");
      return this.getAttribute(attrName);
    } else {
      console.warn("attr is obsolate. please use setAttribute instead of.");
      this.setAttribute(attrName, value);
    }
  }

  public count(): number {
    if (this.components.length === 0) {
      return 0;
    }
    return this.components.map(components =>
      components.map(c => c.length).reduce((total, current) => total + current, 0)
    ).reduce((total, current) => total + current, 0);
  }
}

export default ComponentInterface;
