import ProgramWrapper = require("../../ProgramWrapper");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");
import TextureRegister = require("../../../../../Wrapper/Texture/TextureRegister");
import TextureBase = require("../../../Texture/TextureBase");
import TargetTextureType = require("../../../../../Wrapper/TargetTextureType");
class TextureArrayRegister
{
    public registerVariable(gl: WebGLRenderingContext, index: WebGLUniformLocation, value: any, configure: any)
    {
        if (value != null)
        {
          var textures:TextureBase[] = value;
          var texBegin = configure.registerBegin;
          var texEnd = configure.registerEnd || texBegin+textures.length;
          var texIndicies = new Int32Array(texEnd-texBegin);
          for (let i = texBegin; i < texEnd; i++) {

            if(textures[i-texBegin])
            {
                var tex = (<TextureBase[]>value)[i-texBegin].getForContext(configure.context);
              if(tex.Initialized&&tex.registerTexture(i))
              {
                texIndicies[i-texBegin]=i;
                continue;
              }
            }
            texIndicies[i-texBegin]=0;
          }
          gl.uniform1iv(index,texIndicies);
        }
    }
}

export = TextureArrayRegister;
