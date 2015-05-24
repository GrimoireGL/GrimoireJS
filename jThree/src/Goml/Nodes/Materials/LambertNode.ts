
import Lambert = require("../../../Core/Materials/LambertMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Color4 = require("../../../Base/Color/Color4");
import JThreeID = require("../../../Base/JThreeID");
class LambertNode extends GomlTreeNodeBase
{
    targetMaterial:Lambert;

    constructor(elem:HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase) {
        super(elem,loader,parent);
    }

    beforeLoad()
    {
      this.targetMaterial=new Lambert();
      this.targetMaterial.Color=this.Color;
      this.loader.nodeDictionary.addObject("jthree.materials",this.Name,this);
      this.attributes.defineAttribute({
        "color":{
          value:"#0FC",converter:"color4",handler:(v)=>{this.targetMaterial.Color=v.Value}
        }
      });
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

export=LambertNode;
