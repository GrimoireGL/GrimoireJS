import Material = require("./Material");
import Program = require("../Resources/Program/Program");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Matrix = require("../../Math/Matrix");
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

    public configureMaterial(scene:Scene,renderer: RendererBase, object:SceneObject,texs): void {
          var geometry=object.Geometry;
          var programWrapper = this.program.getForContext(renderer.ContextManager);
          var v=Matrix.multiply(this.matVP,object.Transformer.LocalToGlobal);
          programWrapper.register({
              attributes: { position: geometry.PositionBuffer },
              uniforms: {
                  matMVP: { type: "matrix", value: v }
              }
          });
          geometry.bindIndexBuffer(renderer.ContextManager);
     }
  }

  export=DepthMaterial;
