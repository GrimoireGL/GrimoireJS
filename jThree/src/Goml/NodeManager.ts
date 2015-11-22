import JThreeObject = require('../Base/JThreeObject');
import GomlNodeDictionary = require('../Goml/GomlNodeDictionary');
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import GomlTreeNodeBase = require('../Goml/GomlTreeNodeBase');
import IContextComponent = require('../IContextComponent');
import ContextComponents = require('../ContextComponents');
import BehaviorRegistry = require('./Behaviors/BehaviorRegistry');
import GomlConfigurator = require('./GomlConfigurator');
import GomlParser = require("./GomlParser");
class NodeManager extends JThreeObject implements IContextComponent {

  constructor() {
    super();
  }

  public getContextComponentIndex():number
  {
    return ContextComponents.NodeManager;
  }

  public nodeRegister: GomlNodeDictionary = new GomlNodeDictionary();
  public gomlRoot:GomlTreeNodeBase;
  public htmlRoot:HTMLElement;
  public NodesById: AssociativeArray<GomlTreeNodeBase> = new AssociativeArray<GomlTreeNodeBase>();
  public behaviorRegistry: BehaviorRegistry = new BehaviorRegistry();

  public getNode(id: string): GomlTreeNodeBase {
    return this.NodesById.get(id);
  }

  public getNodeByQuery(query: string): GomlTreeNodeBase[] {
    var result = [];
    var found = this.htmlRoot.querySelectorAll(query);
    for (var index = 0; index < found.length; index++) {
      var id = (<HTMLElement>found[index]).getAttribute("x-j3-id");
      result.push(this.getNode(id));
    }
    return result;
  }

  public instanciateTemplate(template: string, parentNode: GomlTreeNodeBase) {
    var templateInElems = (new DOMParser()).parseFromString(template, 'text/xml').documentElement;
    this.append(templateInElems, parentNode.Element, false);
  }


  private loadTags(top:GomlTreeNodeBase)
  {
    top.callRecursive((v) => (<GomlTreeNodeBase>v).beforeLoad());
    top.callRecursive((v) => (<GomlTreeNodeBase>v).Load());
    top.callRecursive((v) => (<GomlTreeNodeBase>v).afterLoad());
    top.callRecursive((v) => (<GomlTreeNodeBase>v).attributes.applyDefaultValue());
  }

  public append(source: HTMLElement, parent: HTMLElement, needLoad?: boolean) {
    if (typeof needLoad === 'undefined') needLoad = true;
    var id = parent.getAttribute("x-j3-id");
    var parentOfGoml = this.NodesById.get(id);
    var loadedGomls=GomlParser.parseChild(parentOfGoml,source,this.configurator)
    this.loadTags(loadedGomls);
    // var loadedGomls = [];
    // this.parseChild(parentOfGoml, source, (v) => { loadedGomls.push(v) });
    // if (!needLoad) return;
    // this.eachNode(v=> v.beforeLoad(), loadedGomls);
    // this.eachNode(v=> v.Load(), loadedGomls);
    // this.eachNode(v=> v.afterLoad(), loadedGomls);
    // this.eachNode(v=> v.attributes.applyDefaultValue(), loadedGomls);
  }

  /**
   * this configurator will load any tag information by require.
   */
  public configurator: GomlConfigurator = new GomlConfigurator();
}

export = NodeManager;
