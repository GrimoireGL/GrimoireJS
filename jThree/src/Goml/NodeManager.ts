import JThreeObject = require('../Base/JThreeObject');
import GomlNodeDictionary = require('../Goml/GomlNodeDictionary');
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import GomlTreeNodeBase = require('../Goml/GomlTreeNodeBase');
import IContextComponent = require('../IContextComponent');
import ContextComponents = require('../ContextComponents');
import GomlConfigurator = require('./GomlConfigurator');
import BehaviorRegistry = require('./Behaviors/BehaviorRegistry');

class NodeManager extends JThreeObject implements IContextComponent {

  constructor() {
    super();
  }

  public getContextComponentIndex():number
  {
    return ContextComponents.NodeManager;
  }

  public nodeRegister: GomlNodeDictionary = new GomlNodeDictionary();
  public rootNodes: AssociativeArray<GomlTreeNodeBase[]> = new AssociativeArray<GomlTreeNodeBase[]>();
  public NodesById: AssociativeArray<GomlTreeNodeBase> = new AssociativeArray<GomlTreeNodeBase>();
  public behaviorRegistry: BehaviorRegistry = new BehaviorRegistry();

  public getNode(id: string): GomlTreeNodeBase {
    return this.NodesById.get(id);
  }

  public getNodeByQuery(query: string): GomlTreeNodeBase[] {
    var result = [];
    var found = this.rootObj.querySelectorAll(query);
    for (var index = 0; index < found.length; index++) {
      var id = (<HTMLElement>found[index]).getAttribute("x-j3-id");
      result.push(this.getNode(id));
    }
    return result;
  }

  /**
   * this configurator will load any tag information by require.
   */
  public configurator: GomlConfigurator = new GomlConfigurator();
}

export = NodeManager;
