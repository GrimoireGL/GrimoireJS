import J3ObjectBase from "../J3ObjectBase";
import J3Object from "../J3Object";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import SceneObjectNodeBase from "../../Goml/Nodes/SceneObjects/SceneObjectNodeBase";
import SceneObject from "../../Core/SceneObjects/SceneObject";
import Filter from "../Static/Filter";
import NodeOperator from "../Static/NodeOperation";
import ISpecialEasing from "./ISpecialEasing";
import Tween from "./Tween";
import isUndefined from "lodash.isundefined";
import isNumber from "lodash.isnumber";
import isString from "lodash.isstring";
import isFunction from "lodash.isfunction";
import isPlainObject from "lodash.isplainobject";

class Basic extends J3ObjectBase {
  private static effectArgumentFormatter(argu0: any, argu1: any, argu2: any): IOption {
    let option: IOption = {
      duration: 400,
      easing: "swing",
    };
    switch (true) {
      case isUndefined(argu0):
        option = null;
        break;
      case (isPlainObject(argu0) && isUndefined(argu1)):
        option = argu0;
      case (isFunction(argu0) && isUndefined(argu1)):
        option.complete = argu0;
      case (isNumber(argu0) || isString(argu0)):
        option.duration = argu0;
        switch (true) {
          case isUndefined(argu1):
            // duration: number
            break;
          case isFunction(argu1) && isUndefined(argu2):
            // duration: string, complete: () => void
            option.complete = argu1;
            break;
          case isString(argu1):
            option.easing = argu1;
            switch (true) {
              case isUndefined(argu2):
                // duration: string, easing: string
                break;
              case isFunction(argu2):
                // duration: string, easing: string, complete: () => void
                option.complete = argu2;
                break;
              default:
                throw new Error("Argument type is not correct");
            }
          default:
            throw new Error("Argument type is not correct");
        }
      default:
        throw new Error("Argument type is not correct");
    }
    return option;
  }

  private static filterSceneObjectNode(targetNodes: GomlTreeNodeBase[]): SceneObjectNodeBase<SceneObject>[] {
    return (<any[]>targetNodes).filter((node) => {
      return node instanceof SceneObjectNodeBase;
    });
  }

  public show(): J3Object;
  public show(option: IOption): J3Object;
  public show(duration: number): J3Object;
  public show(duration: string): J3Object;
  public show(complete: () => void): J3Object;
  public show(duration: number, complete: () => void): J3Object;
  public show(duration: string, complete: () => void): J3Object;
  public show(duration: number, easing: string): J3Object;
  public show(duration: string, easing: string): J3Object;
  public show(duration: number, easing: string, complete: () => void): J3Object;
  public show(duration: string, easing: string, complete: () => void): J3Object;
  public show(argu0?: any, argu1?: any, argu2?: any): any {
    const option = Basic.effectArgumentFormatter(argu0, argu1, argu2);
    if (option === null) {
      Basic.filterSceneObjectNode(this.__getArray()).forEach((node) => {
        if (node.target) {
          node.target.isVisible = true;
        }
      });
    }
  }

  public hide(): J3Object;
  public hide(option: IOption): J3Object;
  public hide(duration: number): J3Object;
  public hide(duration: string): J3Object;
  public hide(complete: () => void): J3Object;
  public hide(duration: number, complete: () => void): J3Object;
  public hide(duration: string, complete: () => void): J3Object;
  public hide(duration: number, easing: string): J3Object;
  public hide(duration: string, easing: string): J3Object;
  public hide(duration: number, easing: string, complete: () => void): J3Object;
  public hide(duration: string, easing: string, complete: () => void): J3Object;
  public hide(argu0?: any, argu1?: any, argu2?: any): any {
    const option = Basic.effectArgumentFormatter(argu0, argu1, argu2);
    if (option === null) {
      Basic.filterSceneObjectNode(this.__getArray()).forEach((node) => {
        if (node.target) {
          node.target.isVisible = false;
        }
      });
    }
  }
}

export interface IOption {
  duration?: number | string;
  easing?: string;
  queue?: boolean | string;
  specialEasing?: ISpecialEasing;
  step?: (now: number, tweet: Tween) => void;
  progress?: (animation: Promise<any>, progress: number, remainingMs: number) => void;
  complete?: () => void;
  start?: (animation: Promise<any>) => void;
  done?: (animation: Promise<any>, jumpedToEnd: boolean) => void;
  fail?: (animation: Promise<any>, jumpedToEnd: boolean) => void;
  always?: (animation: Promise<any>, jumpToEnd: boolean) => void;
}

export default Basic;
