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

class DepthMaterial extends Material
  {
    private matVP:Matrix;
    
    public get VP():Matrix
    {
      return this.matVP;
    }
    
    public set VP(mat:Matrix)
    {
      this.matVP=mat;
    }

      protected program:Program;
      constructor() {
          super();
          var vs = require('../Shaders/VertexShaders/DepthGeometries.glsl');
          var fs = require('../Shaders/Depth/Depth.glsl');
          this.program = this.loadProgram("jthree.shaders.vertex.depth","jthree.shaders.fragment.depth","jthree.programs.depth",vs,fs);
          this.setLoaded();
      }

     configureMaterial(scene:Scene,renderer: RendererBase, object:SceneObject,texs): void {
          var geometry=object.Geometry;
          var programWrapper = this.program.getForContext(renderer.ContextManager);
          programWrapper.useProgram();
          var v=Matrix.multiply(this.matVP,object.Transformer.LocalToGlobal);
          programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setUniformMatrix("matMVP",v);
          geometry.bindIndexBuffer(renderer.ContextManager);
     }
  }

  export=DepthMaterial;
