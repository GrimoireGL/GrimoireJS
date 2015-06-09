import jThreeObjectWithID = require("../Base/JThreeObjectWithID");
import GomlLoader = require("./GomlLoader");
import GomlAttribute = require("./GomlAttribute");
import AttributeDictionary = require("./AttributeDictionary");
import Delegates = require('../Delegates');
import ComponentContainerNode = require('./ComponentContainerNodeBase');
import TreeNodeBase = require('./TreeNodeBase');

/**
 * This is the most base class in all GomlNode
 */
class GomlTreeNodeBase extends ComponentContainerNode
{
    constructor(elem:HTMLElement,loader:GomlLoader,parent?:TreeNodeBase) {
        super(elem,parent,loader);
        this.attributes=new AttributeDictionary(this,loader,elem);
    }


    /**
     * Attributes this node have.
     */
    public attributes:AttributeDictionary;

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
