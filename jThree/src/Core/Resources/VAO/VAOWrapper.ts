import ResourceWrapper = require("../ResourceWrapper");
import Canvas = require("../../Canvas");
import VAO = require("./VAO");
import GLExtensionList = require("../../GLExtensionList");
/**
 * Provides wrapper class for Render Buffer Object depending on particular WebGLRenderingContext.
 * Most of user may have no reason to modify by themselves.
 */
class VAOWrapper extends ResourceWrapper
{
	/**
	 *	Reference to the WebGLRenderbuffer this class managing.
	  */
	private targetVAO:WebGLVertexArrayObject;

	public get Target():WebGLVertexArrayObject
	{
		return this.targetVAO;
	}

  private vaoInterface:WebGLVertexArrayObjectExtension;
	/**
	 * The parent VAOWrapper container class.
	 */
	private parent:VAO;

	constructor(canvas:Canvas,parentVAO:VAO)
	{
		super(canvas);
		this.parent=parentVAO;
		this.vaoInterface = canvas.GLExtensionManager.getExtension(GLExtensionList.VertexArrayObject);
	}

    public init()
	{
		if(this.Initialized)return;
		this.targetVAO = this.vaoInterface.createVertexArrayOES();
		this.setInitialized();
	}

	public bind()
	{
		//this.GL.bindRenderbuffer(this.targetVAO);
		this.vaoInterface.bindVertexArrayOES(this.targetVAO);
	}
}
export = VAOWrapper;
