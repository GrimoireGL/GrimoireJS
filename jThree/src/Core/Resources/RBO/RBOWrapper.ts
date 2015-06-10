import ResourceWrapper = require('../ResourceWrapper');
import ContextManagerBase = require('../../ContextManagerBase');
class RBOWrapper extends ResourceWrapper
{
	constructor(contextManager:ContextManagerBase)
	{
		super(contextManager);
	}
}
export = RBOWrapper;