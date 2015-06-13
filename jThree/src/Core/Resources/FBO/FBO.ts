import FBOWrapper = require('./FBOWrapper');
import ContextSafeResourceContainer =require('./../ContextSafeResourceContainer');
import JThreeContext = require('../../JThreeContext');
import ContextManagerBase = require('../../ContextManagerBase');
class FBO extends ContextSafeResourceContainer<FBOWrapper>
{
		constructor(context:JThreeContext)
	{
		super(context);
	}
	
	protected getInstanceForRenderer(renderer:ContextManagerBase): FBOWrapper {
		return new FBOWrapper(renderer);
    }

    protected disposeResource(resource: FBOWrapper): void {

    }
}

export =FBO;