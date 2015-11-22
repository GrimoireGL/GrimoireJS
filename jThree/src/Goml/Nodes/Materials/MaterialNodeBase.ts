import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Material = require('../../../Core/Materials/Material');
import JThreeID = require("../../../Base/JThreeID");
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
