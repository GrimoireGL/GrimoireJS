import Vector3 = require('../../../Math/Vector3');
import LightBase = require('./../LightBase');
import Scene = require('../../Scene');
import Matrix = require('../../../Math/Matrix');
import LightTypeDeclaration = require("./../LightTypeDeclaration");
import RendererBase = require("../../Renderers/RendererBase");
import BufferTexture = require("../../Resources/Texture/BufferTexture");
import JThreeContextProxy = require("../../JThreeContextProxy");
import TextureGenerater = require("../../Renderers/TextureGenerater");
import GeneraterInfoChunk = require("../../Renderers/TextureGeneraters/GeneraterInfoChunk");
class ShadowDroppableLight extends LightBase {
	constructor(scene: Scene) {
		super(scene);
    }

    public initializeLight()
    {
      this.shadowMap = TextureGenerater.generateTexture()
    }

    /**
     * The matrix that projects world space to light projection space.
     */
  public matWorldLightProjection:Matrix;

  /**
   * The matrix that projects light projection space to view space.
   */
  public matViewInverseWorldLightProjection:Matrix;

  /**
   * Depth texture for shadow mapping
   */
  public shadowMap:BufferTexture;

  /**
   * Parameter for identify whether shadow droppable light or not.
   */
  public isShadowDroppable = true;
}

export = ShadowDroppableLight;
