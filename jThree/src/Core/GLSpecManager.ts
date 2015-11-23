import GetParameterType = require("../Wrapper/GetParameterType");
import JThreeContext = require("../JThreeContext");
import CanvasManager = require("./CanvasManager");
import ContextComponents = require("../ContextComponents");
class GLSpecManager
{
	private static get GLContext()
	{
		var canvasManager = JThreeContext.getContextComponent<CanvasManager>(ContextComponents.CanvasManager);
		if(canvasManager.canvases.length>0)
		{
			return canvasManager.canvases[0].GL;
		}else{
			console.error("can't obtain the gl context to check gl spec");
		}
	}

	private static getParameterOrCached(cached:number,parameterType:GetParameterType)
	{
		return cached || GLSpecManager.GLContext.getParameter(parameterType);
	}

	private static maxCombinedTextureUnits;

	public static get MaxCombinedTextureUnits()
	{
		return GLSpecManager.maxCombinedTextureUnits = GLSpecManager.getParameterOrCached(GLSpecManager.maxCombinedTextureUnits,GetParameterType.MaxCombinedTextureImageUnits)
	}

	private static maxCubeMapTextureSize;

	public static get MaxCubeMapTextureSize()
	{
		return GLSpecManager.maxCubeMapTextureSize = GLSpecManager.getParameterOrCached(GLSpecManager.maxCubeMapTextureSize,GetParameterType.MaxCubeMapTextureSize);
	}

	private static maxFragmentUniformVectors;

	public static get MaxFragmentUniformVectors()
	{
		return GLSpecManager.maxFragmentUniformVectors = GLSpecManager.getParameterOrCached(GLSpecManager.maxFragmentUniformVectors,GetParameterType.MaxFragmentUniformVectors);
	}

	private static maxRenderbufferSize;

	public static get MaxRenderbufferSize()
	{
		return GLSpecManager.maxRenderbufferSize = GLSpecManager.getParameterOrCached(GLSpecManager.maxRenderbufferSize,GetParameterType.MaxRenderbufferSize);
	}

	private static maxTextureImageUnits;

	public static get MaxTextureImageUnits()
	{
		return GLSpecManager.maxTextureImageUnits = GLSpecManager.getParameterOrCached(GLSpecManager.maxTextureImageUnits,GetParameterType.MaxTextureImageUnits);
	}

	private static maxTextureSize;

	public static get MaxTextureSize()
	{
		return GLSpecManager.maxTextureSize = GLSpecManager.getParameterOrCached(GLSpecManager.maxTextureSize,GetParameterType.MaxTextureSize);
	}

	private static maxVaryingVectors;

	public static get MaxVaryingVectors()
	{
		return GLSpecManager.maxVaryingVectors = GLSpecManager.getParameterOrCached(GLSpecManager.maxVaryingVectors,GetParameterType.MaxVaryingVectors);
	}

	private static maxVertexAttribs;

	public static get MaxVertexAttribs()
	{
		return GLSpecManager.maxVertexAttribs = GLSpecManager.getParameterOrCached(GLSpecManager.maxVertexAttribs,GetParameterType.MaxVertexAttribs);
	}

	private static maxVertexTextureImageUnits;

	public static get MaxVertexTextureImageUnits()
	{
		return GLSpecManager.maxVertexTextureImageUnits = GLSpecManager.getParameterOrCached(GLSpecManager.maxVertexTextureImageUnits,GetParameterType.MaxVertexTextureImageUnits);
	}

	private static maxVertexUniformVectors;

	public static get MaxVertexUniformVectors()
	{
		return GLSpecManager.maxVertexUniformVectors = GLSpecManager.getParameterOrCached(GLSpecManager.maxVertexUniformVectors,GetParameterType.MaxVertexUniformVectors);
	}

	private static maxViewportDims;

	public static get MaxViewportDims()
	{
		return GLSpecManager.maxViewportDims = GLSpecManager.getParameterOrCached(GLSpecManager.maxViewportDims,GetParameterType.MaxViewportDims);
	}
}

export = GLSpecManager;
