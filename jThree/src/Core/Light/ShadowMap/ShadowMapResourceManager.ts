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
    this.shadowMatrixTextureSource = new Float32Array(this.maximumShadowMapCount * 3 * 16);
    this.shadowMatrixTexture = <BufferTexture> JThreeContextProxy.getJThreeContext().ResourceManager.createTexture("shadowmat."+register.scene.ID,12,this.maximumShadowMapCount,TextureInternalFormatType.RGBA,TextureType.Float);
    this.shadowMapRenderBuffer = JThreeContextProxy.getJThreeContext().ResourceManager.createRBO("shadowmap."+register.scene.ID,this.shadowMapTileTextureSize,this.shadowMapTileTextureSize);
  }

  public shadowMapTileTexture:BufferTexture;
  /**
   * Size of shadow map for one of shadow map.
   * @type {number}
   */
  private shadowMapSizeCache:number = 512;

  private shadowMatrixTextureSource:Float32Array;

  public shadowMatrixTexture:BufferTexture;

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
      if(!light)break;
      light.updateLightMatricis(renderer);
      this.copyMatrixToLightMatrixTextureSource(light.matLightProjection,48*i);
      this.copyMatrixToLightMatrixTextureSource(light.matInverseLightProjection,48*i+16);
      this.generateTextureTransformMatrix(48*i+32,i);
    }
    this.shadowMatrixTexture.updateTexture(this.shadowMatrixTextureSource);
  }

  private copyMatrixToLightMatrixTextureSource(data:Matrix,offset:number)
  {
    for (let i = 0; i < 16; i++) {
        this.shadowMatrixTextureSource[offset+i] = data.rawElements[i];
    }
  }

  private generateTextureTransformMatrix(offset:number,index:number)
  {
    var x = index % this.shadowMapTileHeight;
    var y = (index - x)/this.shadowMapTileHeight;
    var sizeTransform = 1/(2*this.shadowMapTileHeight);


    this.shadowMatrixTextureSource[offset + 0] = sizeTransform;
    this.shadowMatrixTextureSource[offset + 1] = 0;
    this.shadowMatrixTextureSource[offset + 2] = 0;
    this.shadowMatrixTextureSource[offset + 3] = 0;

    this.shadowMatrixTextureSource[offset + 4] = 0;
    this.shadowMatrixTextureSource[offset + 5] = sizeTransform;
    this.shadowMatrixTextureSource[offset + 6] = 0;
    this.shadowMatrixTextureSource[offset + 7] = 0;

    this.shadowMatrixTextureSource[offset + 8] =  0;
    this.shadowMatrixTextureSource[offset + 9] =  0;
    this.shadowMatrixTextureSource[offset + 10] = 1;
    this.shadowMatrixTextureSource[offset + 11] = 0;

    this.shadowMatrixTextureSource[offset + 12] = sizeTransform*(2*x+1);
    this.shadowMatrixTextureSource[offset + 13] = sizeTransform*(2*y+1);
    this.shadowMatrixTextureSource[offset + 14] = 0;
    this.shadowMatrixTextureSource[offset + 15] = 1;

  }
}

export = ShadowMapResourceManager;
