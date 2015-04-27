import Material = require("Material");
import Program = require("../Resources/Program/Program");
import JThreeContextProxy = require("../JThreeContextProxy");
import JThreeContext = require("../JThreeContext");
import Shader = require("../Resources/Shader/Shader");
import ShaderType = require("../../Wrapper/ShaderType");
import RendererBase = require("../RendererBase");
import Geometry = require("../Geometry");
import Matrix = require("../../Math/Matrix");
import DrawType = require("../../Wrapper/DrawType");
class BasicMaterial extends Material
  {

      protected program:Program;
      constructor() {
          super();
          var jThreeContext: JThreeContext = JThreeContextProxy.getJThreeContext();
          var vs = document.getElementById("vs");
          var fs = document.getElementById("fs");
          var vsShader: Shader = jThreeContext.ResourceManager.createShader("test-vs", vs.textContent, ShaderType.VertexShader);
          var fsShader: Shader = jThreeContext.ResourceManager.createShader("test-fs", fs.textContent, ShaderType.FragmentShader);
          vsShader.loadAll();
          fsShader.loadAll();
          this.program= jThreeContext.ResourceManager.createProgram("test-progran", [vsShader, fsShader]);
      }
     initial:boolean=false;
     configureMaterial(renderer: RendererBase, geometry: Geometry): void {
         var programWrapper = this.program.getForRenderer(renderer.ContextManager);
         programWrapper.useProgram();
          var vpMat: Matrix;//=Matricies.Matricies.lookAt(new Vector3(0, 0, -1), new Vector3(0, 0, 0), new Vector3(0, 1, 0));
          vpMat = Matrix.identity();//Matricies.Matricies.perspective(Math.PI / 2, 1, 0.1, 10);
         // vpMat = Matricies.Matricies.identity();
          if (!this.initial) {
              console.log(vpMat.toString());
              this.initial = true;
          }
          programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setAttributeVerticies("normal",geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setUniformMatrix("matMVP", vpMat);
          renderer.Context.DrawArrays(DrawType.Triangles, 0, 3);
     }
  }

  export=BasicMaterial;
