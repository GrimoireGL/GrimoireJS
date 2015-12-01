import FBOWrapper = require("./FBOWrapper");
import ContextSafeResourceContainer = require("./../ContextSafeResourceContainer");
import Canvas = require("../../Canvas");
class FBO extends ContextSafeResourceContainer<FBOWrapper>
{
	constructor() {
		super();
		this.initializeForFirst();
	}

	protected getInstanceForRenderer(renderer: Canvas): FBOWrapper {
		return new FBOWrapper(renderer);
    }

    protected disposeResource(resource: FBOWrapper): void {

    }
}

export =FBO;
