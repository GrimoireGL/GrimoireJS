
import Lambert = require("../../../Core/Materials/LambertMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Color4 = require("../../../Base/Color/Color4");
import JThreeID = require("../../../Base/JThreeID");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material');
class LambertNode extends MaterialNodeBase
{
    material:Lambert;

    constructor(elem:HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase) {
        super(elem,loader,parent);
        this.attributes.defineAttribute({
          "color":{
            value:"#f0C",converter:"color4",handler:(v)=>{this.material.Color=v.Value}
          }
        });

    }

    protected ConstructMaterial():Material
    {
      this.material=new Lambert();
      this.material.Color=this.attributes.getValue("color");
      return this.material;
    }

    beforeLoad()
    {
      super.beforeLoad();
    }

}

export=LambertNode;
