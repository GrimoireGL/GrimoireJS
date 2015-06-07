
import Phong = require("../../../Core/Materials/PhongMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Color4 = require("../../../Base/Color/Color4");
import JThreeID = require("../../../Base/JThreeID");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material');
class PhongNode extends MaterialNodeBase
{
    material:Phong;

    constructor(elem:HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase) {
        super(elem,loader,parent);
        this.attributes.defineAttribute({
          "diffuse":{
            value:"#f0C",converter:"color4",handler:(v)=>{this.material.Diffuse=v.Value}
          },
          "ambient":{
            value:"#FFF",converter:"color4",handler:(v)=>{this.material.Ambient=v.Value}
          },
          "specular":
          {
            value:"#CCC",converter:"color3",handler:(v)=>{this.material.Specular=v.Value;}
          },
          "specularpower":
          {
            value:10,converter:"number",handler:(v)=>{this.material.SpecularCoefficient=v.Value;}
          }
        });

    }

    protected ConstructMaterial():Material
    {
      this.material=new Phong();
      this.material.Diffuse=this.attributes.getValue("diffuse");
      this.material.Ambient=this.attributes.getValue("ambient");
      this.material.Specular=this.attributes.getValue("specular");
      this.material.SpecularCoefficient=this.attributes.getValue("specularpower");
      return this.material;
    }

    beforeLoad()
    {
      super.beforeLoad();
    }

}

export=PhongNode;
