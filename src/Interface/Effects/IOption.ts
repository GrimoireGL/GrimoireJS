// import ISpecialEasing from "./ISpecialEasing";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";
import Tween from "./Tween";

export interface IOption {
  duration: number;
  easing: string;
  queue: boolean;
  queueName: string;
  // specialEasing: ISpecialEasing;
  step: (now: number, tween: Tween) => void;
  progress: (animation: Promise<any>, progress: number, remainingMs: number) => void;
  complete: (node: GomlTreeNodeBase) => void;
  start: (animation: Promise<any>) => void;
  done: (animation: Promise<any>, jumpedToEnd: boolean) => void;
  fail: (animation: Promise<any>, jumpedToEnd: boolean) => void;
  always: (animation: Promise<any>, jumpToEnd: boolean) => void;
}

export default IOption;
