import jThreeObjectWithID = require("../Base/JThreeObjectWithID");

class GomlTreeNodeBase extends jThreeObjectWithID
{
    constructor(elem:Element) {
        super();
        this.element = elem;
    }
    protected element: Element;

    private children: GomlTreeNodeBase[]=[];

    protected parent:GomlTreeNodeBase;

    addChild(child: GomlTreeNodeBase) {
        child.parent = this;
        this.children.push(child);
    }
}
export=GomlTreeNodeBase;
