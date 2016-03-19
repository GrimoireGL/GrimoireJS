import ISpecialEasing from "./ISpecialEasing";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import Tween from "./Tween";

export interface IOption {
  duration?: number | string;
  easing?: string;
  queue?: boolean | string;
  specialEasing?: ISpecialEasing;
  step?: (now: number, tweet: Tween) => void;
  progress?: (animation: Promise<any>, progress: number, remainingMs: number) => void;
  complete?: (node: GomlTreeNodeBase) => void;
  start?: (animation: Promise<any>) => void;
  done?: (animation: Promise<any>, jumpedToEnd: boolean) => void;
  fail?: (animation: Promise<any>, jumpedToEnd: boolean) => void;
  always?: (animation: Promise<any>, jumpToEnd: boolean) => void;
}

export default IOption;
