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
      time=0;
     test=0;
     configureMaterial(renderer: RendererBase, object:SceneObject): void {
          this.test++;
          var geometry=object.Geometry;
         var programWrapper = this.program.getForRenderer(renderer.ContextManager);
         this.time+=0.01;
         programWrapper.useProgram();
         // var rotMat:Matrix=Matrix.rotateY(this.time);
          programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setAttributeVerticies("normal",geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setUniformMatrix("matMVP", Matrix.multiply(renderer.Camera.ProjectionMatrix,renderer.Camera.ViewMatrix));
          geometry.IndexBuffer.getForRenderer(renderer.ContextManager).bindBuffer();
          renderer.Context.DrawElements(geometry.PrimitiveTopology, geometry.IndexBuffer.Length,geometry.IndexBuffer.ElementType,0);
     }
  }

  export=BasicMaterial;
