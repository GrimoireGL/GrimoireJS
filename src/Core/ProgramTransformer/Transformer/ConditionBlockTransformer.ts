import SourceTransformer from "./Base/SourceTransformer";
import ConditionBlock from "../Base/ConditionBlock";
import MaterialManager from "../../Materials/MaterialManager";

class ConditionBlockTransformer extends SourceTransformer {

  constructor() {
    super((source) => {
      let block = ConditionBlock.parseCondition(source);
      return block.resolve(MaterialManager);
    });
  }
}

export default ConditionBlockTransformer;
