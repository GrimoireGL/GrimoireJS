import Material = require("../Material");
import Program = require("../Resources/Program/Program");
import JThreeContextProxy = require("../JThreeContextProxy");
import JThreeContext = require("../JThreeContext");
import Shader = require("../Resources/Shader/Shader");
import ShaderType = require("../../Wrapper/ShaderType");
import RendererBase = require("../RendererBase");
import Geometry = require("../Geometry");
import Vector3 = require("../../Math/Vector3");
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
      time=0;
     test=0;
     configureMaterial(renderer: RendererBase, geometry: Geometry): void {
          this.test++;
         var programWrapper = this.program.getForRenderer(renderer.ContextManager);
         this.time+=0.01;
         programWrapper.useProgram();
          var vpMat: Matrix=Matrix.lookAt(new Vector3(0, 0, 1), new Vector3(0, 0, 0), new Vector3(0, 1, 0));
         // var rotMat:Matrix=Matrix.rotateY(this.time);
          var projMat:Matrix=Matrix.perspective(Math.PI/4,1,0.1,10);
         //projMat=Matrix.transpose(projMat);
         // vpMat=Matrix.multiply(vpMat,rotMat);
           vpMat=Matrix.multiply(projMat,vpMat);
          var vecs:Vector3[]=[new Vector3(-1,0,1),new Vector3(0,1,1),new Vector3(1,0,1)];
          // if(this.test%10==0)
          // for (var i = 0; i < vecs.length; i++) {
          //   var element = vecs[i];
          //   console.log("source:{0} -> dest:{1}".format(element,Matrix.transformPoint(vpMat,element)));
          // }        //  vpMat=Matrix.multiply(rotMat,vpMat);
          //vpMat=vpMat.multiplyWith(Matrix.rotateX(this.time));
          programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setAttributeVerticies("normal",geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
          programWrapper.setUniformMatrix("matMVP", vpMat);
          renderer.Context.DrawArrays(DrawType.Triangles, 0, 3);
     }
  }

  export=BasicMaterial;
