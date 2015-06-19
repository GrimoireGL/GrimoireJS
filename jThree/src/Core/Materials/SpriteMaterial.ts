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
import TextureBase = require('../Resources/Texture/TextureBase');
import TargetTextureType = require('../../Wrapper/TargetTextureType');
declare function require(string):string;

class SpriteMaterial extends Material
{
    private texture:TextureBase;
    
    get Texture():TextureBase
    {
      return this.texture;
    }
    
    set Texture(tex:TextureBase)
    {
      this.texture=tex;
    }

      protected program:Program;
      constructor() {
          super();
          var jThreeContext: JThreeContext = JThreeContextProxy.getJThreeContext();
          var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
          var fs = require('../Shaders/Sprite.glsl');
          var rm=jThreeContext.ResourceManager;
          var vsShader: Shader;
          vsShader=rm.createShader("jthree.shaders.vertex.basic",vs,ShaderType.VertexShader);
          var fsShader: Shader = rm.createShader("jthree.shaders.fragment.sprite", fs, ShaderType.FragmentShader);
          vsShader.loadAll();
          fsShader.loadAll();
          this.program= jThreeContext.ResourceManager.createProgram("jthree.programs.sprite", [vsShader, fsShader]);
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
         var tex=this.Texture;
         renderer.ContextManager.Context.ActiveTexture(TextureRegister.Texture0);
         if(tex)tex.getForRenderer(renderer.ContextManager).bind();
         else renderer.GLContext.BindTexture(TargetTextureType.Texture2D,null);
          programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setAttributeVerticies("normal",geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setAttributeVerticies("uv",geometry.UVBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setUniformMatrix("matMVP",v);
          programWrapper.setUniformMatrix("matV",renderer.Camera.ViewMatrix);
          programWrapper.setUniformMatrix("matMV",Matrix.multiply(renderer.Camera.ViewMatrix,object.Transformer.LocalToGlobal));
          programWrapper.setUniform1i("u_sampler",0);
          geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
     }
  }

  export=SpriteMaterial;
