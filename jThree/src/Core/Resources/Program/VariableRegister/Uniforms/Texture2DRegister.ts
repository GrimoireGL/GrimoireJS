import ProgramWrapper = require("../../ProgramWrapper");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");
import TextureRegister = require("../../../../../Wrapper/Texture/TextureRegister");
import TextureBase = require("../../../Texture/TextureBase");
import TargetTextureType = require("../../../../../Wrapper/TargetTextureType");
class Texture2DRegister
{
    public registerVariable(gl: WebGLRenderingContext, index: WebGLUniformLocation, value: any, configure: any)
    {
        var texNumber = configure.register;
        if (value != null)
        {
            var tex = (<TextureBase>value).getForContext(configure.context);
            if (tex.Initialized) {
                if(tex.registerTexture(texNumber))
                    gl.uniform1i(index, texNumber);
                return;
            }
        }
    }
}

export = Texture2DRegister;
