
import Phong = require("../../../Core/Materials/PhongMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material')
import TextureNode = require("../Texture/TextureNode")
class PhongNode extends MaterialNodeBase
{
    public material:Phong;

    constructor(elem:HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase) {
        super(elem,loader,parent);
        this.attributes.defineAttribute({
          "diffuse":{
            value:"#f0C",converter:"color4",handler:(v)=>{this.material.Diffuse=v.Value}
          },
          "ambient":{
            value:"#222",converter:"color4",handler:(v)=>{this.material.Ambient=v.Value}
          },
          "specular":
          {
            value:"#CCC",converter:"color3",handler:(v)=>{this.material.Specular=v.Value;}
          },
          "specularpower":
          {
            value:10,converter:"number",handler:(v)=>{this.material.SpecularCoefficient=v.Value;}
          },
          "texture":
          {
              value:"tex",converter:"string",handler:(v)=> {
                  this.material.Texture = (<TextureNode>this.loader.nodeRegister.getObject("jthree.resource.texture2d", v.Value)).TargetTexture;
              }
          }
        });

    }

    protected ConstructMaterial():Material
    {
      this.material=new Phong();
      return this.material;
    }

    public beforeLoad()
    {
      super.beforeLoad();
    }

    public afterLoad() {
        super.afterLoad();
        this.attributes.applyDefaultValue();
    }

}

export=PhongNode;
