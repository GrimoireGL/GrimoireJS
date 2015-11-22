import AttributeDictionary = require("./AttributeDictionary");
import BehaviorContainerNode = require("./BehaviorContainerNodeBase");
import TreeNodeBase = require('./TreeNodeBase');
import JThreeContext = require("../NJThreeContext");
import NodeManager = require('./NodeManager');
import ContextComponents = require('../ContextComponents');
import BehaviorNode = require("./Nodes/Behaviors/BehaviorNode");
import AssociativeArray = require("../Base/Collections/AssociativeArray");
/**
 * This is the most base class in all GomlNode
 */
class GomlTreeNodeBase extends TreeNodeBase
{
    constructor(elem:HTMLElement, parent?:TreeNodeBase) {
        super(elem, parent);

        //load node manager
        this.nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);

        //configure class name and attribute to HTMLElement to make it easy to find this node in next time.
        elem.classList.add("x-j3-" + this.ID);
        elem.setAttribute('x-j3-id', this.ID);
        //after configuration, this node is going to add to NodesById
        this.nodeManager.NodesById.set(this.ID, this);
        this.attributes=new AttributeDictionary(this, elem);
    }

    public nodeManager: NodeManager;

    /**
     * Attributes this node have.
     */
    public attributes:AttributeDictionary;

    public beforeLoad()
    {
      // this method should be overriden by the class extends this class.
    }

    public Load()
    {
      // this method should be overriden by the class extends this class.
    }

    public afterLoad()
    {
      // this method should be overriden by the class extends this class.
    }

    /**
      * components that is attached to this node.
      */
     protected behaviors:AssociativeArray<BehaviorNode[]>=new AssociativeArray<BehaviorNode[]>();

     /**
      * Add component to this node.
      */
     public addBehavior(behaviors:BehaviorNode):void {
         this.nodeManager.componentRunner.addBehavior(behaviors,this);
         if(!this.behaviors.has(behaviors.BehaviorName))this.behaviors.set(behaviors.BehaviorName,[]);
         this.behaviors.get(behaviors.BehaviorName).push(behaviors);
     }

     public getBehaviors(behaviorName:string):BehaviorNode[]
     {
         return this.behaviors.get(behaviorName);
     }


}
export=GomlTreeNodeBase;
