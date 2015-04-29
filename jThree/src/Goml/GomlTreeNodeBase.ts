import jThreeObjectWithID = require("../Base/JThreeObjectWithID");
import GomlLoader = require("./GomlLoader");
class GomlTreeNodeBase extends jThreeObjectWithID
{
    constructor(elem:Element,loader:GomlLoader,parent:GomlTreeNodeBase) {
        super();
        this.loader=loader;
        this.element = elem;
        if(parent!=null)
        {
          parent.addChild(this);
        }
    }
    protected element: Element;

    protected loader:GomlLoader;

    private children: GomlTreeNodeBase[]=[];

    protected parent:GomlTreeNodeBase;

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
