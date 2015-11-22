import ContextSafeResourceContainer = require("./../ContextSafeResourceContainer");
import VAOWrapper = require("./VAOWrapper");
import RBOInternalFormatType = require("../../../Wrapper/RBO/RBOInternalFormat");
import ContextManagerBase = require("../../../Core/ContextManagerBase");
class VAO extends ContextSafeResourceContainer<VAOWrapper>
{
	constructor()
	{
		super();
		this.initializeForFirst();
	}

	protected getInstanceForRenderer(renderer:ContextManagerBase): VAOWrapper {
		return new VAOWrapper(renderer,this);
    }

    protected disposeResource(resource: VAOWrapper): void {

    }
}

export = VAO;
