import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import JThreeContextProxy = require("../JThreeContextProxy");
import JThreeContext = require("../JThreeContext");
import Shader = require("../Resources/Shader/Shader");
import ShaderType = require("../../Wrapper/ShaderType");
import RendererBase = require("../Renderers/RendererBase");
import Geometry = require("../Geometries/Geometry");
import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
import Vector4 = require('../../Math/Vector4');
import Matrix = require("../../Math/Matrix");
import PrimitiveTopology = require("../../Wrapper/PrimitiveTopology");
import Quaternion = require("../../Math/Quaternion");
import Color4 = require("../../Base/Color/Color4");
import Color3 = require('../../Base/Color/Color3');
import GLCullMode = require("../../Wrapper/GLCullMode");
import GLFeatureType = require("../../Wrapper/GLFeatureType");
import TextureRegister = require('../../Wrapper/Texture/TextureRegister');
declare function require(string):string;

class PhongMaterial extends Material
  {
    private diffuse=Color4.parseColor('#F0F');

    get Diffuse():Color4
    {
      return this.diffuse;
    }

    set Diffuse(col:Color4)
    {
      this.diffuse=col;
    }

    private ambient=Color4.parseColor('#F0F');

    get Ambient():Color4
    {
      return this.ambient;
    }

    set Ambient(col:Color4)
    {
      this.ambient=col;
    }

    private specular = Color3.parseColor('#F0F');
    get Specular():Color3
    {
      return this.specular;
    }

    set Specular(col:Color3)
    {
      this.specular=col;
    }

    private specularCoefficient=10;

    get SpecularCoefficient():number
    {
      return this.specularCoefficient;
    }

    set SpecularCoefficient(val:number)
    {
      this.specularCoefficient=val;
    }

      protected program:Program;
      constructor() {
          super();
          var jThreeContext: JThreeContext = JThreeContextProxy.getJThreeContext();
          var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
          var fs = require('../Shaders/Phong.glsl');
          var rm=jThreeContext.ResourceManager;
          var vsShader: Shader;
          vsShader=rm.createShader("jthree.shaders.vertex.basic",vs,ShaderType.VertexShader);
          var fsShader: Shader = rm.createShader("jthree.shaders.fragment.phong", fs, ShaderType.FragmentShader);
          vsShader.loadAll();
          fsShader.loadAll();
          this.program= jThreeContext.ResourceManager.createorGetProgram("jthree.programs.phong", [vsShader, fsShader]);
      }

     configureMaterial(renderer: RendererBase, object:SceneObject): void {
       super.configureMaterial(renderer,object);
          var geometry=object.Geometry;
         var programWrapper = this.program.getForRenderer(renderer.ContextManager);
         programWrapper.useProgram();
         var v=this.CalculateMVPMatrix(renderer,object);
         var jThreeContext: JThreeContext = JThreeContextProxy.getJThreeContext();
         var resourceManager = jThreeContext.ResourceManager;
         console.log(resourceManager.toString());
         var tex=jThreeContext.ResourceManager.getTexture("test");
         if(tex)tex.getForRenderer(renderer.ContextManager).bind(TextureRegister.Texture0);
          programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setAttributeVerticies("normal",geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setAttributeVerticies("uv",geometry.UVBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setUniformMatrix("matMVP",v);
          programWrapper.setUniformMatrix("matV",renderer.Camera.ViewMatrix);
          programWrapper.setUniformMatrix("matMV",Matrix.multiply(renderer.Camera.ViewMatrix,object.Transformer.LocalToGlobal));
          programWrapper.setUniformVector("u_ambient",this.Ambient.toVector());
          programWrapper.setUniformVector("u_diffuse",this.Diffuse.toVector());
          programWrapper.setUniform1i("u_sampler",0);
          var s=this.Specular.toVector();
          programWrapper.setUniformVector("u_specular",new Vector4(s.X,s.Y,s.Z,this.specularCoefficient));
          programWrapper.setUniformVector("u_DirectionalLight",new Vector3(0,0,-1));
          geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
     }
  }

  export=PhongMaterial;
