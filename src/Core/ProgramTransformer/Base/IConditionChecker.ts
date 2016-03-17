import Q from "q";
interface IConditionChecker {
  checkCondition(condition: JSON): Q.IPromise<boolean>;
}
export default IConditionChecker;
