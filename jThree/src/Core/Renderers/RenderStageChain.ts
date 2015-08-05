import RenderStage = require("./RenderStages/RenderStageBase");
interface RenderStageChain {
	buffers: {
		[name: string]: string
	};
	stage: RenderStage
}

export = RenderStageChain;
