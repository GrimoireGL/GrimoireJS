import Q from "q";
import IConditionChecker from "./IConditionChecker";

interface IConditionRegister {
  registerCondition(type: string, checker: IConditionChecker);
  getConditionChecker(type: string): IConditionChecker;
}
export default IConditionRegister;
