import Canvas from "../../Canvas/Canvas";
import ResourceWrapper from "../ResourceWrapper";
import TextureBase from "../Texture/TextureBase";
import RBO from "../RBO/RBO";
class FBOWrapper extends ResourceWrapper {

  private _targetFBO: WebGLFramebuffer;

  private _textures: TextureBase[] = [];

  constructor(canvas: Canvas) {
    super(canvas);
  }

  public get TargetShader(): WebGLShader {
    if (!this.Initialized) { this.init(); }
    return this._targetFBO;
  }

  public init(): void {
    if (!this.Initialized) {
      this._targetFBO = this.GL.createFramebuffer();
      this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, this._targetFBO);
      this.__setInitialized();
    }
  }

  public bind(): void {
    if (!this.Initialized) { this.init(); }
    this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, this._targetFBO);
  }

  public unbind(): void {
    this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, null);
    /*        this.textures.forEach(tex=> {
                tex.getForContext(this.OwnerCanvas).bind();
                tex.generateMipmapIfNeed();
            });*/
  }

  public attachTexture(attachmentType: number, tex: TextureBase): void {
    if (!this.Initialized) {
      this.init();
    }
    this.bind();
    if (tex == null) {
      this.GL.framebufferTexture2D(this.GL.FRAMEBUFFER, attachmentType, this.GL.TEXTURE_2D, null, 0);
      return;
    }
    let wt = tex.getForGL(this.GL);
    wt.preTextureUpload();
    this.GL.framebufferTexture2D(this.GL.FRAMEBUFFER, attachmentType, this.GL.TEXTURE_2D, wt.TargetTexture, 0);
    tex.getForGL(this.GL).bind();
    tex.generateMipmapIfNeed();
    if (this._textures.indexOf(tex) !== -1) {
      this._textures.push(tex);
    }
    this.GL.bindTexture(tex.TargetTextureType, null);
  }

  public attachRBO(attachmentType: number, rbo: RBO): void {
    if (!this.Initialized) {
      this.init();
    }
    this.bind();
    if (rbo == null) {
      this.GL.framebufferRenderbuffer(this.GL.FRAMEBUFFER, attachmentType, this.GL.RENDERBUFFER, null);
      return;
    }
    let wrapper = rbo.getForGL(this.GL);
    this.GL.framebufferRenderbuffer(this.GL.FRAMEBUFFER, attachmentType, this.GL.RENDERBUFFER, wrapper.Target);
  }

  public dispose(): void {
    if (this.Initialized) {
      this.GL.deleteFramebuffer(this._targetFBO);
      this._targetFBO = null;
      this.__setInitialized(false);
    }
  }
}

export default FBOWrapper;
