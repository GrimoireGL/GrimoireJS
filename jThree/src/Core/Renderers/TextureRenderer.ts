import ViewportRenderer = require('./ViewportRenderer');
import ContextManagerBase = require('./../ContextManagerBase');
import Rectangle = require('./../../Math/Rectangle');
import FBO = require('./../Resources/FBO/FBO');
import Delegates = require('./../../Delegates');
class TextureRenderer extends ViewportRenderer
{
	constructor(contextManager: ContextManagerBase,viewportArea:Rectangle,targetFBO:FBO) {
        super(contextManager,viewportArea);
		this.targetFBO=targetFBO;
    }
	
	private targetFBO:FBO;
	
	public render(drawAct: Delegates.Action0): void {
		this.targetFBO.getForRenderer(this.ContextManager).bind();
       this.ContextManager.beforeRender(this);
        this.applyViewportConfigure();
        drawAct();
        this.ContextManager.Context.Finish();
        this.ContextManager.afterRender(this);
		this.targetFBO.getForRenderer(this.ContextManager).unbind();
    }
}

export = TextureRenderer;