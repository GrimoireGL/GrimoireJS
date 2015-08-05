import ContextSafeResourceContainer = require("./../ContextSafeResourceContainer");
import RBOWrapper = require("./RBOWrapper");
import RBOInternalFormatType = require("../../../Wrapper/RBO/RBOInternalFormat");
import ContextManagerBase = require("../../../Core/ContextManagerBase");
import JThreeContext = require("../../../Core/JThreeContext")
class RBO extends ContextSafeResourceContainer<RBOWrapper>
{
	constructor(context:JThreeContext,width:number,height:number,format:RBOInternalFormatType=RBOInternalFormatType.DepthComponent16)
	{
		super(context);
		this.width=width;
		this.height=height;
		this.format=format;
		this.initializeForFirst();
	}
	
	private width:number;
	private height:number;
	private format:RBOInternalFormatType;
	public get Width():number
	{
		return this.width;
	}
	
	public get Height():number
	{
		return this.height;
	}
	
	public get Format():RBOInternalFormatType
	{
		return this.format;
	}
	
	protected getInstanceForRenderer(renderer:ContextManagerBase): RBOWrapper {
		return new RBOWrapper(renderer,this);
    }

    protected disposeResource(resource: RBOWrapper): void {

    }

    public resize(width:number,height:number)
	{
		if(this.width!==width||this.height!==height)
		{
			this.width=width;
			this.height=height;
			this.each(v=>(<RBOWrapper>v).resize(width,height));
		}
	}
}

export = RBO;