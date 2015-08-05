import PluginDeclaration = require("./PluginDeclaration");
import PluginRequest = require("./PluginRequest");
import AssociativeArray = require("./../../Base/Collections/AssociativeArray");
import Delegates = require("../../Base/Delegates");
import agent = require("superagent");
class PluginLoader {
	private plugins: AssociativeArray<PluginDeclaration> = new AssociativeArray<PluginDeclaration>();


	public resolvePlugins(plugins: PluginRequest[], completed: Delegates.Action0) {
		var dependencies = new AssociativeArray<PluginDeclaration>();
		//make sure there is no dependency conflict
		var resolveOrder = [];
		this.resolveToAll(plugins, dependencies, resolveOrder, () => completed());
	}

	private resolveToAll(plugins: PluginRequest[], dependency: AssociativeArray<PluginDeclaration>, resolveOrder: PluginDeclaration[], onComplete: Delegates.Action0) {
		if (!plugins||plugins.length==0) {
			onComplete();
			return;
		}
		var count = plugins.length;
		plugins.forEach(v=> {
			this.getDeclaration(v, (d) => {
				this.conflictCheck(d, dependency, resolveOrder, () => {
					count--;
					if (count == 0) {
						onComplete();
					}
				});
			});
		});
	}

	private conflictCheck(current: PluginDeclaration, dependency: AssociativeArray<PluginDeclaration>, resolveOrder: PluginDeclaration[], onComplete: Delegates.Action0) {
		var decl = current;
		console.warn("resolved:" + decl.name);
		if (dependency.has(decl.id)) {//can conflict
			if (this.needReplace(dependency.get(decl.id), decl)) {
				dependency.set(decl.id, decl);
			}
		}
		if (decl.dependencies) {
			this.resolveToAll(decl.dependencies, dependency, resolveOrder, () => {
				resolveOrder.push(decl);
				onComplete();
			});
		} else {
			resolveOrder.push(decl);
			onComplete();
		}
	}

	private needReplace(base: PluginDeclaration, target: PluginDeclaration): boolean {
		if (base.versionId == target.versionId) return false;
		if (base.versionId > target.versionId) {
			console.warn(`plugin:${base.name} has over 2 different version dependencies which is ${base.versionId} and ${target.versionId}.\n jThree will resolve this dependency as version ${base.versionId}`);
			return false;
		}
		console.warn(`plugin:${base.name} has over 2 different version dependencies which is ${base.versionId} and ${target.versionId}.\n jThree will resolve this dependency as version ${target.versionId}`);
		return true;
	}

	private getDeclaration(request: PluginRequest, success: Delegates.Action1<PluginDeclaration>) {
		return agent.get(`${request.id}-${request.versionId}.json`).end((e, r) => {
			success(JSON.parse(r.text));
		});
	}

}

export = PluginLoader;