import PluginDeclaration = require('./PluginDeclaration');
interface PluginRequest {
	provider?: string,
	id: string,
	versionId: number,
	hash?:string
}

export = PluginRequest;