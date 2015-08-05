interface PluginRequest {
	provider?: string;
	id: string;
	versionId: number;
	hash?:string;
}

export = PluginRequest;
