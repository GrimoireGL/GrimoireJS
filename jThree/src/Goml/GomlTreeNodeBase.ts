import jThreeObjectWithID = require("../Base/JThreeObjectWithID");
import GomlLoader = require("./GomlLoader");
import GomlAttribute = require("./GomlAttribute");
import AttributeDictionary = require("./AttributeDictionary");
class GomlTreeNodeBase extends jThreeObjectWithID
{
    constructor(elem:HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase) {
        super();
        this.loader=loader;
        this.element = elem;
        if(parent!=null)
        {
          parent.addChild(this);
        }
        this.attributes=new AttributeDictionary(loader,elem);
    }
    protected element: Element;

    protected loader:GomlLoader;

    private children: GomlTreeNodeBase[]=[];

    protected parent:GomlTreeNodeBase;

    public attributes:AttributeDictionary;

    addChild(child: GomlTreeNodeBase) {
        child.parent = this;
        this.children.push(child);
        console.log("append {0} to {1} as child".format(child.toString(),parent.toString()));
    }

    beforeLoad()
    {

    }

    Load()
    {

    }

    afterLoad()
    {

    }
}
export=GomlTreeNodeBase;
