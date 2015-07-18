import JThreeContextProxy = require('./JThreeContextProxy');
import GetParameterType = require('../Wrapper/GetParameterType');
class GLSpecManager
{
	private static get Context()
	{
		return JThreeContextProxy.getJThreeContext();
	}

	private static get GLContext()
	{
		if(this.Context.CanvasManagers.length>0)
		{
			return this.Context.CanvasManagers[0].Context;
		}else{
			console.error("can't obtain the gl context to check gl spec");
		}
	}

	private static maxTextureCount;
	public static get MaxTextureCount()
	{
		return this.maxTextureCount = this.maxTextureCount || this.GLContext.GetParameter(GetParameterType.MaxCombinedTextureUnits);
	}
}

export = GLSpecManager;