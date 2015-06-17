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
import Matrix = require("../../Math/Matrix");
import PrimitiveTopology = require("../../Wrapper/PrimitiveTopology");
import Quaternion = require("../../Math/Quaternion");
import Color4 = require("../../Base/Color/Color4");
declare function require(string):string;

class SolidColorMaterial extends Material
  {
    private color:Color4=Color4.parseColor('#F0F');

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
          var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
          var fs = require('../Shaders/SolidColor.glsl');
          var rm=jThreeContext.ResourceManager;
          var vsShader: Shader;
          vsShader=rm.createShader("jthree.shaders.vertex.basic",vs,ShaderType.VertexShader);
          var fsShader: Shader = rm.createShader("jthree.shaders.fragment.solidcolor", fs, ShaderType.FragmentShader);
          vsShader.loadAll();
          fsShader.loadAll();
          this.program= jThreeContext.ResourceManager.createProgram("jthree.programs.solidcolor", [vsShader, fsShader]);
      }

     configureMaterial(renderer: RendererBase, object:SceneObject): void {
       super.configureMaterial(renderer,object);
          var geometry=object.Geometry;
         var programWrapper = this.program.getForRenderer(renderer.ContextManager);
         programWrapper.useProgram();
         var v=this.CalculateMVPMatrix(renderer,object);
          programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setAttributeVerticies("normal",geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setUniformMatrix("matMVP",v);
          programWrapper.setUniformMatrix("matMV",Matrix.multiply(renderer.Camera.ViewMatrix,object.Transformer.LocalToGlobal));
          programWrapper.setUniformVector("u_color",this.Color.toVector());
          geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
          renderer.Context.DrawElements(geometry.PrimitiveTopology, geometry.IndexBuffer.Length,geometry.IndexBuffer.ElementType,0);
     }
  }

  export=SolidColorMaterial;
