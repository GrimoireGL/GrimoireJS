import Q from 'q';

class TestConditionChecker {
  constructor(type) {
    this.type = type;
  }

  checkCondition(condition) {
    if (condition.type === this.type) {
      let d = Q.defer();
      d.resolve(true);
      return d.promise;
    } else {
      let d = Q.defer();
      d.resolve(false);
      return d.promise;
    }
  }
}

export default TestConditionChecker;
