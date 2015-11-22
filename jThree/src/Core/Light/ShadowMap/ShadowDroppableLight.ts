import Vector3 = require('../../../Math/Vector3');
import LightBase = require('./../LightBase');
import Scene = require('../../Scene');
import Matrix = require('../../../Math/Matrix');
import LightTypeDeclaration = require("./../LightTypeDeclaration");
import RendererBase = require("../../Renderers/RendererBase");
import BufferTexture = require("../../Resources/Texture/BufferTexture");
import TextureGenerater = require("../../Renderers/TextureGenerater");
import GeneraterInfoChunk = require("../../Renderers/TextureGeneraters/GeneraterInfoChunk");
class ShadowDroppableLight extends LightBase {
	constructor(scene: Scene) {
		super(scene);
    }

 public updateLightMatricis(renderer:RendererBase)
 {

 }

 protected updateLightProjection(renderer:RendererBase,lightProjection:Matrix)
 {
	 this.matLightProjection = lightProjection;
	 this.matInverseLightProjection = Matrix.multiply(renderer.Camera.viewMatrix,Matrix.inverse(lightProjection));
 }

 /**
　* The matrix that projects world space to light projection space.
  */
  public matLightProjection:Matrix = Matrix.identity();

  /**
   * The matrix that projects light projection space to view space.
   */
  public matInverseLightProjection:Matrix=Matrix.identity();

  /**
   * Parameter for identify whether shadow droppable light or not.
   */
  public isShadowDroppable = true;
}

export = ShadowDroppableLight;
