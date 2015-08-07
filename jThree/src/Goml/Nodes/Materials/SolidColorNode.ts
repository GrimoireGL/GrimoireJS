
import SolidColor = require("../../../Core/Materials/SolidColorMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import MaterialNodeBase = require('./MaterialNodeBase');
import GomlLoader = require("../../GomlLoader");
import Material = require('../../../Core/Materials/Material');
class SolidColorNode extends MaterialNodeBase
{
    public material:SolidColor;

    constructor(elem:HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase) {
        super(elem,loader,parent);
        this.attributes.defineAttribute({
          "color":{
            value:"#0FC",converter:"color4",handler:(v)=>{this.material.Color=v.Value}
          }
        });

    }

    protected ConstructMaterial():Material
    {
      this.material=new SolidColor();
      return this.material;
    }

    public beforeLoad()
    {
      super.beforeLoad();
    }
}

export=SolidColorNode;
