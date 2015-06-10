import JThreeObject = require('../Base/JThreeObject');
import AssociativeArray = require('../Base/Collections/AssociativeArray');
class GLExtensionManager extends JThreeObject
{
	private requiredExtensions:string[]=["WEBGL_draw_buffers"];
	private extensions:AssociativeArray<any>=new AssociativeArray<any>();
	
	
	constructor()
	{
		super();
	}
	
	public checkExtensions(context:WebGLRenderingContext)
	{
		for (var i = 0; i < this.requiredExtensions.length; i++) {
			var element = this.requiredExtensions[i];
			var ext=context.getExtension(element);
			if(!ext)
			{
				console.error(`WebGL Extension:${element} was requested,but your browser is not supporting this feature.`)
			}
			this.extensions.set(element,ext);
		}
	}
	
	public getExtension(extName:string):any
	{
		return this.extensions.get(extName);
	}
	
}
export = GLExtensionManager;