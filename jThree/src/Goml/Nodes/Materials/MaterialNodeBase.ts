import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Material = require('../../../Core/Materials/Material');
import JThreeID = require("../../../Base/JThreeID");
import MaterialPass = require("../../../Core/Materials/Base/MaterialPass");
class MaterialNodeBase extends GomlTreeNodeBase
{
    public targetMaterial:Material;

    protected ConstructMaterial():Material
    {
      return null;
    }

    constructor(elem:HTMLElement,parent:GomlTreeNodeBase) {
        super(elem,parent);
        this.attributes.defineAttribute({
        });
    }

    public beforeLoad()
    {
      this.targetMaterial=this.ConstructMaterial();
      if(this.targetMaterial["__passes"])
      {
        let passes = this.targetMaterial["__passes"];
        debugger;
      }
      this.nodeManager.nodeRegister.addObject("jthree.materials",this.Name,this);
    }

    private name:string;
    /**
    * GOML Attribute
    * Identical Name for camera
    */
    public get Name():string{
      this.name=this.name||this.element.getAttribute('name')||JThreeID.getUniqueRandom(10);
      return this.name;
    }

}

export=MaterialNodeBase;
