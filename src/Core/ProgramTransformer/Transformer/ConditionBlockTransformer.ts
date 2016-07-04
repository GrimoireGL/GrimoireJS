import SourceTransformer from "./Base/SourceTransformer";
import ConditionBlock from "../Base/ConditionBlock";
import Context from "../../../Context";
import ContextComponents from "../../../ContextComponents";
import MaterialManager from "../../Materials/MaterialManager";

class ConditionBlockTransformer extends SourceTransformer {

  constructor() {
    super((source) => {
      let block = ConditionBlock.parseCondition(source);
      let conditionRegister = Context.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
      return block.resolve(conditionRegister);
    });
  }
}

export default ConditionBlockTransformer;
