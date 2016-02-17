import {Action1} from "../../Base/Delegates";
import GomlTreeNodeBase from "../GomlTreeNodeBase";
import GomlAttributeDeclaration from "../AttributeDeclaration";

interface BehaviorDeclarationBody {
  /**
   * The number of order for execution.
   * If this number is low, it will be executed faster.
   * Default:1000
   */
  order?: number;

  attributes?: GomlAttributeDeclaration;

  /**
   * Is this component enabled or not.
   * Default:True
   */
  enabled?: boolean;

  onEnabled?: Action1<GomlTreeNodeBase>;

  onDisabled?: Action1<GomlTreeNodeBase>;

  /**
   * The handler to process when this component is loaded.
   */
  awake?: Action1<GomlTreeNodeBase>;

  /**
   * This handler will be
   */
  start?: Action1<GomlTreeNodeBase>;

  /**
   * The handler to process when frame will be update.
   */
  update?: Action1<GomlTreeNodeBase>;
}

export default BehaviorDeclarationBody;
