import LightRegister = require("../LightRegister");
import RendererBase = require("../../Renderers/RendererBase");
import JThreeContextProxy = require("../../JThreeContextProxy");
import TextureInternalFormatType = require("../../../Wrapper/TextureInternalFormatType");
import TextureType = require("../../../Wrapper/TextureType");
import BufferTexture = require("../../Resources/Texture/BufferTexture");
class ShadowMapResourceManager
{
  constructor(register:LightRegister)
  {
    this.shadowMapTileTexture=<BufferTexture>JThreeContextProxy.getJThreeContext().ResourceManager.createTexture("shadowmap."+register.scene.ID,this.shadowMapTileTextureSize,this.shadowMapTileTextureSize,TextureInternalFormatType.RGB,TextureType.UnsignedByte);
  }
  public shadowMapTileTexture:BufferTexture;
  /**
   * Size of shadow map for one of shadow map.
   * @type {number}
   */
  private shadowMapSizeCache:number = 512;

  public get shadowMapSize()
  {
    return this.shadowMapSizeCache;
  }

  public set shadowMapSize(size:number)
  {
    this.shadowMapSizeCache = size;
  }

  public set maximumShadowMapCount(count:number)
  {
    this.shadowMapTileHeight = Math.ceil(Math.sqrt(count));
  }

  /**
   * Shadow map tile size. This property contain how many shadow map is placed one of edge.
   * @type {number}
   */
  private shadowMapTileHeight:number=2;

  /**
   * Shadow map tile texture size.
   */
  public get shadowMapTileTextureSize()
  {
    return this.shadowMapTileHeight * this.shadowMapSizeCache;
  }

  /**
   * Set shadow map viewport when rendering shadow map.
   */
  public setShadowMapViewport(renderer:RendererBase,shadowMapIndex:number)
  {
    var x = shadowMapIndex % this.shadowMapTileHeight;
    var y = (shadowMapIndex - x)/this.shadowMapTileHeight;
    renderer.GLContext.ViewPort(x,y,this.shadowMapSizeCache,this.shadowMapSizeCache);
  }
}

export = ShadowMapResourceManager;
