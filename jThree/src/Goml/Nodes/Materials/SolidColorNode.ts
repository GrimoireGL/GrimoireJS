import BasicMaterial = require("../../../Core/Materials/Base/BasicMaterial");
import SolidColor = require("../../../Core/Materials/Forward/SolidColorMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material');
class SolidColorNode extends MaterialNodeBase
{
    public material:BasicMaterial;

    constructor(elem:HTMLElement,parent:GomlTreeNodeBase) {
        super(elem,parent);
        // this.attributes.defineAttribute({
        //   "color":{
        //     value:"#0FC",converter:"color4",handler:(v)=>{this.material.Color=v.Value}
        //   }
        // });
    }

    protected ConstructMaterial():Material
    {
      this.material=new BasicMaterial(require("../../../Core/Materials/BuiltIn/Materials/SolidColor.html"));
      return this.material;
    }

    public beforeLoad()
    {
      super.beforeLoad();
    }
}

export=SolidColorNode;
