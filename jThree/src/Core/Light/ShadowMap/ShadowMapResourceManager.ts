import LightRegister = require("../LightRegister");
import RendererBase = require("../../Renderers/RendererBase");
import JThreeContextProxy = require("../../JThreeContextProxy");
import TextureInternalFormatType = require("../../../Wrapper/TextureInternalFormatType");
import TextureType = require("../../../Wrapper/TextureType");
import BufferTexture = require("../../Resources/Texture/BufferTexture");
import ShadowDroppableLight = require("./ShadowDroppableLight");
import Matrix = require("../../../Math/Matrix");
import RBO = require("../../Resources/RBO/RBO");
class ShadowMapResourceManager
{
  constructor(register:LightRegister)
  {
    this.shadowMapTileTexture=<BufferTexture>JThreeContextProxy.getJThreeContext().ResourceManager.createTexture("shadowmap."+register.scene.ID,this.shadowMapTileTextureSize,this.shadowMapTileTextureSize,TextureInternalFormatType.RGB,TextureType.UnsignedByte);
    this.shadowMatrixTextureSource = new Float32Array(this.maximumShadowMapCount * 2 * 16);
    this.shadowMatrixTexture = <BufferTexture> JThreeContextProxy.getJThreeContext().ResourceManager.createTexture("shadowmat."+register.scene.ID,8,this.maximumShadowMapCount,TextureInternalFormatType.RGBA,TextureType.Float);
    this.shadowMapRenderBuffer = JThreeContextProxy.getJThreeContext().ResourceManager.createRBO("shadowmap."+register.scene.ID,this.shadowMapTileTextureSize,this.shadowMapTileTextureSize);
  }

  public shadowMapTileTexture:BufferTexture;
  /**
   * Size of shadow map for one of shadow map.
   * @type {number}
   */
  private shadowMapSizeCache:number = 512;

  private shadowMatrixTextureSource:Float32Array;

  private shadowMatrixTexture:BufferTexture;

  public shadowMapRenderBuffer:RBO;

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

  public get maximumShadowMapCount()
  {
    return this.shadowMapTileHeight*this.shadowMapTileHeight;
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
    renderer.GLContext.ViewPort(x*this.shadowMapSizeCache,y*this.shadowMapSizeCache,this.shadowMapSizeCache,this.shadowMapSizeCache);
  }

  public updateLightMatricis(renderer:RendererBase,lights:ShadowDroppableLight[])
  {
    for (let i = 0; i < Math.min(lights.length,this.maximumShadowMapCount); i++)
    {
      var light = lights[i];
      if(!light)return;
      light.updateLightMatricis(renderer);
      this.copyMatrixToLightMatrixTextureSource(light.matLightProjection,32*i);
      this.copyMatrixToLightMatrixTextureSource(light.matInverseLightProjection,32*i+16);
    }
    this.shadowMatrixTexture.updateTexture(this.shadowMatrixTextureSource);
  }

  private copyMatrixToLightMatrixTextureSource(data:Matrix,offset:number)
  {
    for (let i = 0; i < 16; i++) {
        this.shadowMatrixTextureSource[offset+i] = data.rawElements[i];
    }
  }
}

export = ShadowMapResourceManager;
