import ComponentBase from "./ComponentBase";
import GomlAttribute from "./GomlAttribute";
import IDObject from "../Base/IDObject";
import NodeRecipe from "./NodeRecipe";
// import {EventEmitter} from "events";

class GomlNode extends IDObject {
  public children: GomlNode[];
  public components: ComponentBase[];
  public attributes: { [key: string]: GomlAttribute[] }; // 同一名は配列で格納。名前空間で区別

  private _nodeName: string;
  private _parent: GomlNode;
  private _mounted: boolean = false;
  private _nodeRecipe: NodeRecipe;

  public get nodeName(): string {
    return this._nodeName;
  }

  public get parent(): GomlNode {
    return this._parent;
  }

  public get Mounted(): boolean {
    return this._mounted;
  }
  public get Recipe(): NodeRecipe {
    return this._nodeRecipe;
  }

  constructor(recipe: NodeRecipe, components: ComponentBase[], attributes: { [key: string]: GomlAttribute[] }) {
    super();
    this._nodeName = recipe.Name;
    this._nodeRecipe = recipe;
    this.components = components;
    this.attributes = attributes;
  }


  public sendMessage(message: string, ...args: any[]): void {
    for (let component in this.components) {
      let method = component[message];
      if (typeof method === "function") {
        method(args);
      }
    }
  }
  public broadcastMessage(name: string, ...args: any[]): void {
    this.sendMessage(name, args);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].broadcastMessage(name, args);
    }
  }

  /**
* Add child to this node
* @param {TreeNodeBase} child Target node to be inserted
* @param {number}       index Index of insert location in children. If this argument is null or undefined, target will be inserted in last. If this argument is negative number, target will be inserted in index from last.
*/
  public addChild(child: GomlNode, index?: number): void {
    child._parent = this;
    if (index === undefined) {
      index = null;
    }
    const insertIndex = index == null ? this.children.length : index;
    this.children.splice(insertIndex, 0, child);
    if (this.Mounted) {
      child._setMounted(true);
      this._onChildAdded(child);
    }
  }
  /**
  * remove child of this node
  * @param  {TreeNodeBase} child
  */
  public removeChild(child: GomlNode): void {
    for (let i = 0; i < this.children.length; i++) {
      let v = this.children[i];
      if (v === child) {
        child._parent = null;
        this.children.splice(i, 1);
        if (this.Mounted) {
          child._setMounted(false);
          this._onChildRemoved(child);
        }
        // TODO: events after-treatment
        child = null;
        break;
      }
    }
  }

  /**
   * remove myself
   */
  public remove(): void {
    if (this.parent) {
      this.parent.removeChild(this);
    } else {
      throw new Error("root Node cannot be removed.");
    }
  }

  public forEachAttr(callbackfn: (value: GomlAttribute, key: string) => void): GomlNode {
    Object.keys(this.attributes).forEach((k) => {
      let v = this.attributes[k];
      v.forEach((attr) => { callbackfn(attr, k); });
    }, this);
    return this;
  }

  public getValue(attrName: string): any {
    const attr = this.getAttribute(attrName);
    if (attr === undefined) {
      throw new Error(`attribute "${attrName}" is not found.`);
    } else {
      return attr.Value;
    }
  }

  public getValueStr(attrName: string): string {
    const attr = this.getAttribute(attrName);
    if (attr === undefined) {
      throw new Error(`attribute "${attrName}" is not found.`);
    } else {
      return attr.ValueStr;
    }
  }

  public setValue(attrName: string, value: any): void {
    // TODO: 引数が名前空間を含むかどうかで分岐
    const attr = this.getAttribute(attrName);
    if (attr === undefined) {
      console.warn(`attribute "${attrName}" is not found.`);
    } else {
      if (attr.constant) {
        console.error(`attribute: ${attrName} is constant attribute`);
        return;
      }
      attr.Value = value;
    }
  }

  public getAttribute(attrName: string): GomlAttribute {
    let reg = /^(\w+):(\w+)$/gm;
    let match = attrName.match(reg);
    const namespace = match.length === 3 ? this._getNamespace(match[1]) : undefined;
    const name = match.length === 3 ? match[2] : attrName;

    let attrList = this.attributes[name];
    if (!attrList) {
      throw new Error(`attribute "${attrName}" is not found.`);
    }
    if (attrList.length === 1) {
      return attrList[0];
    }
    const ret = attrList.find((attr) => attr.Namespace === namespace);
    if (!ret) {
      throw new Error(`attribute "${attrName}" is not found.`);
    }
    return ret;
  }

  /**
   * Check the attribute passed is defined or not.
   */
  public isDefined(attrName: string): boolean {
    return this.attributes[attrName] !== undefined;
  }

  /**
   * Define attributes to the node.
   *
   * This method must not be called outside of Node classes.
   * If you define already defined attribute, it will be replaced.
   */
  // public defineAttribute(attributes: {[key:string]:GomlAttribute}): void {
  //     // console.log("attributes_declaration", attributes);
  //     for (let key in attributes) {
  //         const attribute = attributes[key];
  //         const converter = attribute.Converter;
  //         const existed_attribute = this.getAttribute(key);
  //         let gomlAttribute: GomlAttribute = null;
  //         if (existed_attribute && existed_attribute.reserved) {
  //             // console.log("define_attribute(override)", key, attribute, this.node.getTypeName());
  //             gomlAttribute = existed_attribute;
  //             gomlAttribute.Converter = converter;
  //             gomlAttribute.constant = attribute.constant;
  //             gomlAttribute.Value = gomlAttribute.ValueStr;
  //             gomlAttribute.reserved = false;
  //             gomlAttribute.on("changed", attribute.onchanged.bind(this._node));
  //         } else {
  //             gomlAttribute = new GomlAttribute(key, attribute.value, converter, attribute.reserved, attribute.constant);
  //             if (attribute.reserved) {
  //                 // console.log("define_attribute(temp)", key, attribute, this.node.getTypeName());
  //             } else {
  //                 // console.log("define_attribute", key, attribute, this.node.getTypeName());
  //                 if (attribute.onchanged) {
  //                     gomlAttribute.on("changed", attribute.onchanged.bind(this._node));
  //                 } else {
  //                     console.warn(`attribute "${key}" does not have onchange event handler. this causes lack of attribute's consistency.`);
  //                 }
  //             }
  //             this._attributes[key] = gomlAttribute;
  //         }
  //         if (this._node.Mounted && !gomlAttribute.reserved) {
  //             gomlAttribute.notifyValueChanged();
  //         }
  //     }
  // }

  /**
   * Reserve attribute for define.
   *
   * This method could be called from outside of Node classes.
   */
  // public reserveAttribute(name: string, value: any): GomlAttribute {
  //     const attribute: AttributeDeclaration = { [name]: { value, reserved: true } };
  //     this.defineAttribute(attribute);
  //     return this.getAttribute(name);
  // }

  /**
   * Emit change events to all attributes
   */
  public emitChangeAll(): void {
    Object.keys(this.attributes).forEach((k) => {
      let v = this.attributes[k];
      v.forEach((attr) => {
        if (typeof attr.Value !== "undefined") {
          attr.notifyValueChanged();
        }
      });
    });
  }

  public updateValue(attrName?: string): void { // ? すべてはemitChangeAllなのに,一つの場合はupdateValue?
    if (typeof attrName === "undefined") {
      Object.keys(this.attributes).forEach((k) => {
        let v = this.attributes[k];
        v.forEach((attr) => {
          attr.notifyValueChanged();
        });
      });
    } else {
      const target = this.getAttribute(attrName);
      target.notifyValueChanged();
    }
  }

  /**
   * This method is called when child is added
   * This method should be overridden.
   */
  private _onChildAdded(child: GomlNode): void {
    // this.emit("child-added", child); TODO:イベントエミッタ実装
  };

  /**
   * This method is called when child is removed
   * This method should be overridden.
   */
  private _onChildRemoved(child: GomlNode): void {
    // this.emit("child-removed", child);
  };

  /**
   * This method is called when this node is mounted to available tree.
   * If you change attribute here, no events are fired.
   * This method should be overridden.
   */
  private _onMount(): void {
    this._mounted = true;
    // this.emit("on-mount");
    this.children.forEach((child) => {
      child._onMount();
    });
    // this.emit("node-mount-process-finished", this._mounted); // this will be move ??
  };

  /**
   * This method is called when this node is unmounted from available tree.
   * You can still access parent.
   * This method should be overridden.
   */
  private _onUnmount(): void {
    // this.emit("on-unmount");
    this.children.forEach((child) => {
      child._onUnmount();
    });
    this._mounted = false;
    // this.emit("node-unmount-process-finished", this._mounted); // this will be move
    return;
  };

  private _setMounted(mounted: boolean): void {
    if ((mounted && !this._mounted) || (!mounted && this._mounted)) {
      if (mounted) {
        this._onMount();
      } else {
        this._onUnmount();
      }
    }
  }

  private _getNamespace(alias: string): string {
    // TODO: implement!!!
    return undefined;
  }


}


export default GomlNode;
