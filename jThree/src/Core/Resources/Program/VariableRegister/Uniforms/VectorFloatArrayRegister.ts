import UniformVariableRegisterBase = require("./UniformVariableRegisterBase");
import Vector2 = require("../../../../../Math/Vector2");
import Vector3 = require("../../../../../Math/Vector3");
import Vector4 = require("../../../../../Math/Vector4");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");
import VectorBase = require("../../../../../Math/VectorBase");

class VectorFloatArrayRegister extends UniformVariableRegisterBase
{
    public registerVariable(gl: WebGLRenderingContext, index: WebGLUniformLocation, value: any, configure: any)
    {
        var vec = <VectorBase[]>value;
        if (vec.length > 0) {
            switch (vec[0].ElementCount) {
            case 2:
              var arr=new Array(vec.length*2);
              for(var i=0;i<vec.length;i++)
              {
                arr[i*2]=(<Vector2>vec[i]).X;
                arr[i*2+1]=(<Vector2>vec[i]).Y;
              }
              gl.uniform2fv(index,new Float32Array(arr));
              break;
            case 3:
            var arr=new Array(vec.length*3);
            for(var i=0;i<vec.length;i++)
            {
              arr[i*3]=(<Vector3>vec[i]).X;
              arr[i*3+1]=(<Vector3>vec[i]).Y;
              arr[i*3+2]=(<Vector3>vec[i]).Z;
            }
            gl.uniform3fv(index,new Float32Array(arr));
            break;
            case 4:
            var arr=new Array(vec.length*4);
            for(var i=0;i<vec.length;i++)
            {
              arr[i*4]=(<Vector4>vec[i]).X;
              arr[i*4+1]=(<Vector4>vec[i]).Y;
              arr[i*4+2]=(<Vector4>vec[i]).Z;
              arr[i*4+3]=(<Vector4>vec[i]).W;
            }
            gl.uniform4fv(index,new Float32Array(arr));
            break;
            }
        }
    }
}

export = VectorFloatArrayRegister;
