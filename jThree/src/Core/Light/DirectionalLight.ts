import Vector3 = require("../../Math/Vector3");
import LightBase = require("./LightBase");
import Scene = require("../Scene");
import Matrix = require("../../Math/Matrix");
import DepthRenderStage = require("../Renderers/RenderStages/ShadowMaps/DirectionalShadowMapStage");
class DirectionalLight extends LightBase {
	constructor(scene: Scene) {
		super(scene);
				this.vp = Matrix.multiply(Matrix.ortho(-2.828, 2.828, -1, 1, 0, 5.656), Matrix.lookAt(new Vector3(1,2,-3), new Vector3(0, 1, 0), new Vector3(0, 1, 0)));
		scene.Renderers.forEach(v=> {
			var stage = new DepthRenderStage(v)
			this.targetStages.push(stage);
			v.RenderStageManager.StageChains.unshift({
				buffers: {
					"OUT": "jthree.light.dir1"
				},
				stage: stage
			});;
		});
		scene.rendererAdded((o, v) => {
			var stage = new DepthRenderStage(v)
			this.targetStages.push(stage);
			v.RenderStageManager.StageChains.unshift({
				buffers: {
					"OUT": "jthree.light.dir1"
				},
				stage: stage
			});;
			stage.VP=this.vp;
		});
		this.targetStages.forEach(v=> {
			v.VP = this.vp;
		});
	}

	private intensity: number = 1.0;

	private targetStages: DepthRenderStage[] = [];

	private vp: Matrix;

	public get VP(): Matrix {
		return this.vp;
	}
	
	/**
	 * Light's intensity
	 */
	public get Intensity(): number {
		return this.intensity;
	}
	
	/**
	 * Light's intensity
	 */
	public set Intensity(intensity: number) {
		this.intensity = intensity;
	}

	public get AliasName(): string {
		return "jthree.lights.directionallight";
	}
}

export = DirectionalLight;