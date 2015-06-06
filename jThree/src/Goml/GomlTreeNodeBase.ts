import jThreeObjectWithID = require("../Base/JThreeObjectWithID");
import GomlLoader = require("./GomlLoader");
import GomlAttribute = require("./GomlAttribute");
import AttributeDictionary = require("./AttributeDictionary");
import Delegates = require('../Delegates');
import ModuleContainerNode = require('./ModuleContainerNodeBase');
import TreeNodeBase = require('./TreeNodeBase');

/**
 * This is the most base class in all GomlNode
 */
class GomlTreeNodeBase extends ModuleContainerNode
{
    constructor(elem:HTMLElement,loader:GomlLoader,parent?:TreeNodeBase) {
        super(elem,parent);
        this.loader=loader;
        this.attributes=new AttributeDictionary(this,loader,elem);
    }
    /**
     * The GomlLoader instanciate this class
     */
    protected loader:GomlLoader;

    /**
     * Attributes this node have.
     */
    public attributes:AttributeDictionary;


    update()
    {
      debugger;
      this.modules.forEach(v=>{
        if(v.update)v.update();
      });
    }

    beforeLoad()
    {
      //this method should be overriden by the class extends this class.
    }

    Load()
    {
      //this method should be overriden by the class extends this class.
    }

    afterLoad()
    {
      //this method should be overriden by the class extends this class.
    }


}
export=GomlTreeNodeBase;
