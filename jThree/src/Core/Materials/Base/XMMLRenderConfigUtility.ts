class XMMLRenderConfigUtility {
    public static applyCullConfigure(gl: WebGLRenderingContext, doc: Document, defEnabled: boolean, defDirection: string): void {
        const cullNode = doc.querySelector("cull");
        if(!cullNode)this._applyCullConfigureToGL(gl,defEnabled,defDirection);
        const modeStr = cullNode.getAttribute("mode");
        if(!modeStr)
        {
          this._applyCullConfigureToGL(gl,defEnabled,defDirection);
        }else
        {
          if(modeStr == "none")
            this._applyCullConfigureToGL(gl,false,"");
          else
            this._applyCullConfigureToGL(gl,true,modeStr);
        }
    }

    private static _applyCullConfigureToGL(gl: WebGLRenderingContext, enabled: boolean, direction: string): void {
        if (enabled) {
            gl.enable(gl.CULL_FACE);
            switch (direction) {
                case "ccw":
                    gl.cullFace(gl.CCW);
                    return;
                case "cw":
                default:
                    gl.cullFace(gl.CW);
            }
        }else{
          gl.disable(gl.CULL_FACE);
        }
    }

    public static applyDepthTestConfigure(gl:WebGLRenderingContext,doc:Document,defEnabled:boolean):void
    {
      const depthNode = doc.querySelector("depth");
      if(!depthNode)this._applyDepthTestConfigureToGL(gl,defEnabled);
    }

    private static _applyDepthTestConfigureToGL(gl:WebGLRenderingContext,enabled:boolean):void
    {
      if(enabled)
        gl.enable(gl.DEPTH_TEST);
      else
        gl.disable(gl.DEPTH_TEST);
    }
}

export = XMMLRenderConfigUtility;
