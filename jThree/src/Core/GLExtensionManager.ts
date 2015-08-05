import JThreeObject = require("../Base/JThreeObject");
import AssociativeArray = require("../Base/Collections/AssociativeArray");
import GLContextWrapperBase = require("../Wrapper/GLContextWrapperBase");
class GLExtensionManager extends JThreeObject
{
	private requiredExtensions:string[]=["WEBGL_draw_buffers","WEBGL_depth_texture","OES_element_index_uint","OES_texture_float"];
	private extensions:AssociativeArray<any>=new AssociativeArray<any>();
	
	constructor()
	{
		super();
	}
	
	public checkExtensions(context:GLContextWrapperBase)
	{
		for (var i = 0; i < this.requiredExtensions.length; i++) {
			var element = this.requiredExtensions[i];
			var ext=context.Context.getExtension(element);
			if(!ext)
			{
				console.error(`WebGL Extension:${element} was requested,but your browser is not supporting this feature.`)
			}else{
				console.log(`WebGL Extension:${element} was instanciated successfully`);
			}
			this.extensions.set(element,ext);
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