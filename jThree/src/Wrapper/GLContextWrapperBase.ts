import Exceptions = require("../Exceptions");
import BufferTargetType = require("./BufferTargetType");
import ShaderType = require("./ShaderType");
import ClearTargetType = require("./ClearTargetType");
import PrimitiveTopology = require("./PrimitiveTopology");
import ElementType = require("./ElementType");
import Matrix = require("../Math/Matrix");
import JThreeObject = require("../Base/JThreeObject");
import Vector2 = require("../Math/Vector2");
import Vector3 = require("../Math/Vector3");
import Vector4 = require("../Math/Vector4");
import GLFeatureType = require("./GLFeatureType");
import GLCullMode = require("./GLCullMode");
import TargetTextureType = require("./TargetTextureType");
import FrameBufferAttachmentType = require("./FrameBufferAttachmentType");
import TextureInternalFormatType = require("./TextureInternalFormatType");
import TextureType = require("./TextureType");
import TextureParameterType = require("./Texture/TextureParameterType");
import TextureMinType = require("./Texture/TextureMinFilterType");
import TextureMagType = require("./Texture/TextureMagFilterType");
import TextureWrapType = require("./Texture/TextureWrapType");
import TextureRegister = require("./Texture/TextureRegister");
import RenderBufferInternalFormats = require("./RBO/RBOInternalFormat");
import PixelStoreParamType = require("./Texture/PixelStoreParamType");
import BlendEquationType = require("./BlendEquationType");
import BlendFuncParamType = require("./BlendFuncParamType");
import DepthFuncType = require("./DepthFuncType");
import GetParameterType = require("./GetParameterType");
import TexImageTargetType = require("./Texture/TexImageTargetType");
import JThreeEvent = require("../Base/JThreeEvent");
import Delegates = require("../Base/Delegates");
class GLContextWrapperBase extends JThreeObject
{
    /**
     * Maximum count of errors to be dislayed.
     */
    public static maximumOutputGLError = 1000;

    private glErrorCount=0;
    /**
     * Event handler register to gl error.
     */
    private glErrorHandler = new JThreeEvent<string>();

    protected notifyGlError(error: string) {
        this.glErrorCount++;
        if(this.glErrorCount<=GLContextWrapperBase.maximumOutputGLError)this.glErrorHandler.fire(this, error);
        if (this.glErrorCount === GLContextWrapperBase.maximumOutputGLError) {
            console.error("There is too many glError,for preventing freezing error not displayed any more.");
        }
    }

    public glError(listener:Delegates.Action2<GLContextWrapperBase,string>) {
        this.glErrorHandler.addListener(listener);
    }

    public get Context(): WebGLRenderingContext
    {
        return null;
    }
}
export =GLContextWrapperBase;
