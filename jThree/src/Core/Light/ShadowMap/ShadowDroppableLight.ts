import Vector3 = require('../../../Math/Vector3');
import LightBase = require('./../LightBase');
import Scene = require('../../Scene');
import Matrix = require('../../../Math/Matrix');
import LightTypeDeclaration = require("./../LightTypeDeclaration");
import RendererBase = require("../../Renderers/RendererBase");
import BufferTexture = require("../../Resources/Texture/BufferTexture");

class ShadowDroppableLight extends LightBase {
	constructor(scene: Scene) {
		super(scene);
    }
	private vp: Matrix;

	public get VP(): Matrix {
		return this.vp;
	}

  private shadowMap:BufferTexture;

  
}

export = ShadowDroppableLight;
