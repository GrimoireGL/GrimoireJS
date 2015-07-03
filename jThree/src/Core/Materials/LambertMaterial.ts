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
import GLCullMode = require("../../Wrapper/GLCullMode");
import GLFeatureType = require("../../Wrapper/GLFeatureType");
import Scene = require('../Scene');
declare function require(string):string;

class LambertMaterial extends Material
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
          var vs = require('../Shaders/VertexShaders/BasicGeometries.glsl');
          var fs = require('../Shaders/Lambert.glsl');
          this.program = this.loadProgram("jthree.shaders.vertex.basic","jthree.shaders.fragment.lambert","jthree.programs.lambert",vs,fs);
      }

     configureMaterial(scene:Scene,renderer: RendererBase, object:SceneObject): void {
       super.configureMaterial(scene,renderer,object);
          var geometry=object.Geometry;
         var programWrapper = this.program.getForContext(renderer.ContextManager);
         programWrapper.useProgram();
         var v=object.Transformer.calculateMVPMatrix(renderer);
          programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setAttributeVerticies("normal",geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setAttributeVerticies("uv",geometry.UVBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setUniformMatrix("matMVP",v);
          programWrapper.setUniformMatrix("matV",renderer.Camera.ViewMatrix);
          programWrapper.setUniformMatrix("matMV",Matrix.multiply(renderer.Camera.ViewMatrix,object.Transformer.LocalToGlobal));
          programWrapper.setUniformVector("u_color",this.Color.toVector());
          programWrapper.setUniformVector("u_DirectionalLight",new Vector3(0,0,-1));
          geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
     }
  }

  export=LambertMaterial;
