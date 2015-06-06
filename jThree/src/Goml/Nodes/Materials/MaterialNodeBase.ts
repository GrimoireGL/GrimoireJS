
import Lambert = require("../../../Core/Materials/LambertMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Color4 = require("../../../Base/Color/Color4");
import Material = require('../../../Core/Materials/Material');
import JThreeID = require("../../../Base/JThreeID");
class MaterialNodeBase extends GomlTreeNodeBase
{
    public targetMaterial:Material;

    protected ConstructMaterial():Material
    {
      return null;
    }

    constructor(elem:HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase) {
        super(elem,loader,parent);
        this.attributes.defineAttribute({
          "cull":
          {
            value:true,
            converter:"boolean",
            handler:(v)=>{this.targetMaterial.CullEnabled=v.Value;}
          }
        });
    }

    beforeLoad()
    {
      this.targetMaterial=this.ConstructMaterial();
      this.loader.nodeRegister.addObject("jthree.materials",this.Name,this);
      this.targetMaterial.CullEnabled=this.attributes.getValue("cull");
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

}

export=MaterialNodeBase;
