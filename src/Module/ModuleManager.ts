import IDObject from "../Base/IDObject";
import IContextComponent from "../IContextComponent";
import ContextComponents from "../ContextComponents";
import Context from "../Context";
import LoopManager from "../Core/LoopManager";
import ModuleInstanceRegistry from "./ModuleInstanceRegistry";
import Module from "./Module";

class ModuleManager extends IDObject implements IContextComponent {
  public ready: boolean = false;
  private _modules: ModuleInstanceRegistry[] = [];

  constructor() {
    super();
    const loopManager = Context.getContextComponent<LoopManager>(ContextComponents.LoopManager);
    loopManager.addAction(2000, () => this.update());
  }

  public getContextComponentIndex(): number {
    return ContextComponents.ModuleManager;
  }

  public update(): void {
    if (!this.ready) {
      return;
    }
    this._modules.forEach((moduleRegistry) => {
      moduleRegistry.update();
    });
  }

  public addModule(module: new () => Module): ModuleInstanceRegistry {
    const moduleRegistry = new ModuleInstanceRegistry(module);
    this._modules.push(moduleRegistry);
    return moduleRegistry;
  }

  public removeModule(moduleRegistry: ModuleInstanceRegistry): void {
    const index = this._modules.indexOf(moduleRegistry);
    if (index === -1) {
      throw new Error("target module instance is not found");
    } else {
      this._modules.splice(index, 1);
    }
  }
}

export default ModuleManager;
