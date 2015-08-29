import FBOWrapper = require("./FBOWrapper");
import ContextSafeResourceContainer = require("./../ContextSafeResourceContainer");
import ContextManagerBase = require("../../ContextManagerBase");
class FBO extends ContextSafeResourceContainer<FBOWrapper>
{
	constructor() {
		super();
		this.initializeForFirst();
	}

	protected getInstanceForRenderer(renderer: ContextManagerBase): FBOWrapper {
		return new FBOWrapper(renderer);
    }

    protected disposeResource(resource: FBOWrapper): void {

    }
}

export =FBO;