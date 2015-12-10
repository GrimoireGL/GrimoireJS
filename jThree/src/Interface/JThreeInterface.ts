import JThreeObject = require("../Base/JThreeObject");
import Timer = require("../Core/Timer");
import GomlTreeNodeBase = require("../Goml/GomlTreeNodeBase");
import Delegate = require("../Base/Delegates");
import InterfaceBase = require('./InterfaceBase');

/**
 * Provides jQuery like API for jThree.
 */
class JThreeInterface extends InterfaceBase {
  constructor(query: string) {
    super();
  //   var targetObject: NodeList = this.nodeManager.htmlRoot.querySelectorAll(<string>query); //call as query
  //   this.target = new Array(NodeList.length).map((i) => {
  //     return this.nodeManager.getNodeByElement(NodeList[i]);
  //   });
  }

  // public target: GomlTreeNodeBase[];

  // public attr(attrName: string);
  // public attr(attrTargets: { [key: string]: any });
  // public attr(attrName: string, val: Delegate.Func2<number,　string,　any>);
  // public attr(attrName: string, val: any);
  // public attr(attrTarget: { [key: string]: any } | string, val?: Delegate.Func2<number, string, any> | any): JThreeInterface | any {
  //   if (typeof attrTarget === "string") {
  //     if (val) {
  //       if (typeof val === "function") {
  //         var f1 = (attrName: string, func: Delegate.Func2<number, string, any>) => {
  //           for (let i = 0; i < this.target.length; i++) {
  //             ((i) => {
  //               var gomlNode = this.target[i];
  //               this.setAttrValue(attrName, func(i, attrName), <HTMLElement>e, gomlNode);
  //             })(i);
  //           }
  //           this.dequeue();
  //         }
  //         this.queue(() => { f1(attrTarget,val); });
  //         return this;
  //       } else {
  //         var f2 = (attrName: string, value:any) => {
  //           for (let i = 0; i < this.target.length; i++) {
  //             ((i) => {
  //               var e = this.target[i]
  //               var gomlNode = this.nodeManager.getNodeByElement(<HTMLElement>e);
  //               this.setAttrValue(attrName,  value, <HTMLElement>e, gomlNode);
  //             })(i);
  //           }
  //           this.dequeue();
  //         }
  //         this.queue(() => { f2(attrTarget, val); });
  //         return this;
  //       }
  //     }else
  //       return this.getAttr(<string>attrTarget);
  //   } else if (typeof attrTarget === "object") {
  //     var f = (attrTarget: { [key: string]: any }) => {
  //       for (let i = 0; i < this.target.length; i++) {
  //         ((i) => {
  //           var e = this.target[i]
  //           var gomlNode = this.nodeManager.getNodeByElement(<HTMLElement>e);
  //           for (var attrName in attrTarget) {
  //             var value = attrTarget[attrName];
  //             this.setAttrValue(attrName, value, <HTMLElement>e, gomlNode);
  //           }
  //         })(i);
  //       }
  //       this.dequeue();
  //     }
  //     this.queue(() => { f(<{ [key: string]: any }>attrTarget); });
  //     return this;
  //   }
  // }

  // private getAttr(attrName: string): any {
  //   if (this.target.length === 0) return undefined;
  //   var target =  <HTMLElement>this.target[0];
  //   var targetGoml = this.nodeManager.getNodeByElement(target);
  //   if (targetGoml.attributes.isDefined(attrName)) {
  //     return targetGoml.attributes.getValue(attrName);
  //   } else {
  //     return target.attributes.getNamedItem(attrName).value;
  //   }
  // }

  // private setAttrValue(attrName: string, attrValue: any, e: HTMLElement, gomlNode: GomlTreeNodeBase) {
  //   if (gomlNode.attributes.isDefined(attrName)) {
  //     gomlNode.attributes.setValue(attrName, attrValue);
  //   } else {
  //     e.setAttribute(attrName, attrValue);
  //   }
  // }
}

export = JThreeInterface;
