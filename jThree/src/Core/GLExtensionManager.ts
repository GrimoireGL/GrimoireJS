import JThreeObject = require("../Base/JThreeObject");
import AssociativeArray = require("../Base/Collections/AssociativeArray");
import GLContextWrapperBase = require("../Wrapper/GLContextWrapperBase");
import JThreeLogger = require("../Base/JThreeLogger");
class GLExtensionManager extends JThreeObject
{
    private requiredExtensions =
    ["WEBGL_draw_buffers",
     "WEBGL_depth_texture",
     "OES_element_index_uint",
      "OES_texture_float",
    "EXT_texture_filter_anisotropic"];
	private extensions:AssociativeArray<any>=new AssociativeArray<any>();

	constructor()
	{
		super();
	}

	public checkExtensions(context:GLContextWrapperBase)
	{
		for (var i = 0; i < this.requiredExtensions.length; i++) {
            var element = this.requiredExtensions[i];
		    var ext;
		    if (typeof element === "string") {
		        ext = context.Context.getExtension(element);
		    } else {
		        //Assume type of element is array
		        for (var j = 0; j < element.length; j++) {
                    ext = context.Context.getExtension(element[j]);
                    if(ext)break;
		        }
		    }
		    if(!ext) {
			    console.error(`WebGL Extension:${element} was requested,but your browser is not supporting this feature.`);
			}else{
                JThreeLogger.sectionLog("GL Extension",`${element} was instanciated successfully`);
                this.extensions.set(element, ext);
			}
		}
	}

	public getExtension(extName:string):any
	{
		return this.extensions.get(extName);
	}

	public hasExtension(extName:string):boolean
	{
		return this.extensions.has(extName);
	}

}
export = GLExtensionManager;
