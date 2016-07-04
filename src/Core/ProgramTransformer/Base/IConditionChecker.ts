interface IConditionChecker {
  checkCondition(condition: JSON): Promise<boolean>;
}
export default IConditionChecker;
