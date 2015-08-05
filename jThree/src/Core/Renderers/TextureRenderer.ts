import ViewportRenderer = require("./ViewportRenderer");
import ContextManagerBase = require("./../ContextManagerBase");
import Rectangle = require("./../../Math/Rectangle");
import FBO = require("./../Resources/FBO/FBO");

class TextureRenderer extends ViewportRenderer {
    constructor(contextManager: ContextManagerBase, viewportArea: Rectangle, targetFBO: FBO) {
        super(contextManager, viewportArea);
        this.targetFBO = targetFBO;
    }

    private targetFBO: FBO;

    beforeRender() {
        this.targetFBO.getForContext(this.ContextManager).bind();
        super.beforeRender();
    }

    afterRender() {
        super.afterRender();
        this.targetFBO.getForContext(this.ContextManager).unbind();
    }
}

export = TextureRenderer;