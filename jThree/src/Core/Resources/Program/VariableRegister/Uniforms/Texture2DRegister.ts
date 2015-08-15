import ProgramWrapper = require("../../ProgramWrapper");
import GlContextWrapperBase = require("../../../../../Wrapper/GLContextWrapperBase");
import TextureRegister = require("../../../../../Wrapper/Texture/TextureRegister");
import TextureBase = require("../../../Texture/TextureBase");
import TargetTextureType = require("../../../../../Wrapper/TargetTextureType");
class Texture2DRegister
{
    public registerVariable(gl: GlContextWrapperBase, index: WebGLUniformLocation, value: any, configure: any)
    {
        var texNumber = configure.register | 0;
        gl.ActiveTexture(TextureRegister.Texture0 + texNumber);
        if (value != null)
        {
            (<TextureBase>value).getForContext(configure.context).bind();
        } else
        {
            gl.BindTexture(TargetTextureType.Texture2D, null);
        }
        gl.Uniform1i(index, texNumber);
    }
}

export = Texture2DRegister; 