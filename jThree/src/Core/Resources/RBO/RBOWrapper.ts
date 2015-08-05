import ResourceWrapper = require("../ResourceWrapper");
import ContextManagerBase = require("../../ContextManagerBase");
import RBO = require("./RBO");
/**
 * Provides wrapper class for Render Buffer Object depending on particular WebGLRenderingContext.
 * Most of user may have no reason to modify by themselves.
 */
class RBOWrapper extends ResourceWrapper
{
	/**
	 *	Reference to the WebGLRenderbuffer this class managing.
	  */
	private targetRBO:WebGLRenderbuffer;	
	
	public get Target():WebGLRenderbuffer
	{
		return this.targetRBO;
	}
	/**
	 * The parent RBOWrapper container class.
	 */
	private parent:RBO;
	
	constructor(contextManager:ContextManagerBase,parentRBO:RBO)
	{
		super(contextManager);
		this.parent=parentRBO;
	}
	
	init()
	{
		if(this.Initialized)return;
		this.targetRBO=this.WebGLContext.CreateRenderBuffer();
		this.bind();
		this.WebGLContext.RenderBufferStorage(this.parent.Format,this.parent.Width,this.parent.Height);
		this.setInitialized();
	}

	public bind()
	{
		this.WebGLContext.BindRenderBuffer(this.targetRBO);
	}

	public resize(width: number, height: number) {
		if (this.Initialized) {
			this.bind();
			this.WebGLContext.RenderBufferStorage(this.parent.Format,this.parent.Width,this.parent.Height);
		}
	}
}
export = RBOWrapper;