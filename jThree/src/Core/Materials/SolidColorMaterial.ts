import Material = require("../Material");
import Program = require("../Resources/Program/Program");
import JThreeContextProxy = require("../JThreeContextProxy");
import JThreeContext = require("../JThreeContext");
import Shader = require("../Resources/Shader/Shader");
import ShaderType = require("../../Wrapper/ShaderType");
import RendererBase = require("../RendererBase");
import Geometry = require("../Geometry");
import SceneObject = require("../SceneObject");
import Vector3 = require("../../Math/Vector3");
import Matrix = require("../../Math/Matrix");
import PrimitiveTopology = require("../../Wrapper/PrimitiveTopology");
import Quaternion = require("../../Math/Quaternion");
import Color4 = require("../../Base/Color/Color4");
declare function require(string):string;

class SolidColorMaterial extends Material
  {
    private color:Color4;

    get Color():Color4
    {
      return this.color;
    }

set Color(col:Color4)
{
  this.color=col;
}
      protected program:Program;
      constructor() {
          super();
          var jThreeContext: JThreeContext = JThreeContextProxy.getJThreeContext();
          var vs = document.getElementById("vs");
          var fs = require('../Shaders/SolidColor.glsl');
          var rm=jThreeContext.ResourceManager;
          var vsShader: Shader;
          if(!rm.hasShader("test-vs"))
          {
            vsShader=jThreeContext.ResourceManager.createShader("test-vs", vs.textContent, ShaderType.VertexShader);
          }else{
            vsShader=rm.getShader("test-vs");
          }
          var fsShader: Shader = rm.createOrGetShader("jthree.shaders.solidcolor", fs, ShaderType.FragmentShader);
          vsShader.loadAll();
          fsShader.loadAll();
          this.program= jThreeContext.ResourceManager.createProgram("jthree.programs.solidcolor", [vsShader, fsShader]);
      }
     configureMaterial(renderer: RendererBase, object:SceneObject): void {
          var geometry=object.Geometry;
         var programWrapper = this.program.getForRenderer(renderer.ContextManager);
         programWrapper.useProgram();
         var v=this.CalculateMVPMatrix(renderer,object);
         console.log(object.Transformer.LocalToGlobal.toString());
          programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setAttributeVerticies("normal",geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setUniformMatrix("matMVP",v);
          programWrapper.setUniformVector("u_color",this.Color.toVector());
          geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
          renderer.Context.DrawElements(geometry.PrimitiveTopology, geometry.IndexBuffer.Length,geometry.IndexBuffer.ElementType,0);
     }
  }

  export=SolidColorMaterial;
