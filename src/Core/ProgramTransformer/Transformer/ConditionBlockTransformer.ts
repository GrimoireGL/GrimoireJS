import SourceTransformer from "./Base/SourceTransformer";
import ConditionBlock from "../Base/ConditionBlock";
import JThreeContext from "../../../JThreeContext";
import ContextComponents from "../../../ContextComponents";
import MaterialManager from "../../Materials/MaterialManager";

class ConditionBlockTransformer extends SourceTransformer {

  constructor() {
    super((source) => {
      let block = ConditionBlock.parseCondition(source);
      let conditionRegister = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
      return block.resolve(conditionRegister);
    });
  }
}

export default ConditionBlockTransformer;
