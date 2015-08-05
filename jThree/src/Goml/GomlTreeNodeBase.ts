import GomlLoader = require("./GomlLoader");
import AttributeDictionary = require("./AttributeDictionary");
import ComponentContainerNode = require("./ComponentContainerNodeBase");
import TreeNodeBase = require("./TreeNodeBase");

/**
 * This is the most base class in all GomlNode
 */
class GomlTreeNodeBase extends ComponentContainerNode
{
    constructor(elem:HTMLElement,loader:GomlLoader,parent?:TreeNodeBase) {
        super(elem,parent,loader);
        //configure class name and attribute to HTMLElement to make it easy to find this node in next time.
        elem.classList.add("x-j3-" + this.ID);
        elem.setAttribute("x-j3-id", this.ID);
        //after configuration, this node is going to add to NodesById
        loader.NodesById.set(this.ID, this);
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
