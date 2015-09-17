
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
            value:"#f0C",converter:"color4",handler:(v)=>{this.material.diffuse=v.Value}
          },
          "ambient":{
            value:"#222",converter:"color4",handler:(v)=>{this.material.ambient=v.Value}
          },
          "specular":
          {
            value:"#CCC",converter:"color3",handler:(v)=>{this.material.specular=v.Value;}
          },
          "specularpower":
          {
            value:10,converter:"number",handler:(v)=>{this.material.specularCoefficient=v.Value;}
          },
          "texture":
          {
              value:null, converter: "string", handler: (v) =>
              {
                  if(v.Value)
                  this.material.texture = (<TextureNode>this.loader.nodeRegister.getObject("jthree.resource.texture2d", v.Value)).TargetTexture;
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
