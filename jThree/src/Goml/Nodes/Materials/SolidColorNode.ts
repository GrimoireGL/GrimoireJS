
import SolidColor = require("../../../Core/Materials/SolidColorMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Color4 = require("../../../Base/Color/Color4");
import JThreeID = require("../../../Base/JThreeID");
class SolidColorNode extends GomlTreeNodeBase
{
    targetMaterial:SolidColor;

    constructor(elem:Element,loader:GomlLoader,parent:GomlTreeNodeBase) {
        super(elem,loader,parent);
    }

    beforeLoad()
    {
      this.targetMaterial=new SolidColor();
      this.targetMaterial.Color=this.Color;
      this.loader.nodeDictionary.addObject("jthree.materials",this.Name,this);
    }

    private name:string;
    /**
    * GOML Attribute
    * Identical Name for camera
    */
    get Name():string{
      this.name=this.name||this.element.getAttribute('name')||JThreeID.getUniqueRandom(10);
      return this.name;
    }

        private color:Color4;
        get Color():Color4
        {
          this.color=this.color||Color4.parseColor(this.element.getAttribute('color')||'#0FF');
          return this.color;
        }


}

export=SolidColorNode;
