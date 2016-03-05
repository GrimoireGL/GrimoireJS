class TestConditionRegister {
  constructor() {
    this.dict = {};
  }

  registerCondition(type, checker) {
    this.dict[type] = checker;
  }

  getConditionChecker(type) {
    return this.dict[type];
  }
}

export default TestConditionRegister;
