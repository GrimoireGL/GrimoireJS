import ProgramWrapper = require("../../ProgramWrapper");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");
import TextureRegister = require("../../../../../Wrapper/Texture/TextureRegister");
import TextureBase = require("../../../Texture/TextureBase");
import TargetTextureType = require("../../../../../Wrapper/TargetTextureType");
class Texture2DRegister
{
    public registerVariable(gl: GlContextWrapperBase, index: WebGLUniformLocation, value: any, configure: any)
    {
        var texNumber = configure.register;
        if (value != null)
        {
            var tex = (<TextureBase>value).getForContext(configure.context);
            if (tex.Initialized) {
                if (tex.Parent.TargetTextureType == TargetTextureType.CubeTexture)debugger;
                if(tex.registerTexture(texNumber))
                    gl.Uniform1i(index, texNumber);
                return;
            }
        }
    }
}

export = Texture2DRegister; 