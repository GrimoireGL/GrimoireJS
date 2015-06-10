import ContextSafeResourceContainer = require('./../ContextSafeResourceContainer');
import RBOWrapper = require('./RBOWrapper');
import RBOInternalFormatType = require('../../../Wrapper/RBO/RBOInternalFormat');
class RBO
{
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
}