import IModule from "./IModule";
import GomlTreeNodeBase from "../Goml/GomlTreeNodeBase";
import ModuleInstanceRegistry from "./ModuleInstanceRegistry";

class Module implements IModule {
  public enabled: boolean = false;

  /* tslint:disable:public-method-name private-method-name */
  public __registry__: ModuleInstanceRegistry;
  /* tslint:enable:public-method-name */

  public detach: {
    (): void;
  };

  public update(node: GomlTreeNodeBase): void {
    return;
  }

  public start(node: GomlTreeNodeBase): void {
    return;
  }

  public terminate(node: GomlTreeNodeBase): void {
    return;
  }

  public initialize(): void {
    return;
  }

  /* tslint:disable:public-method-name private-method-name */
  public __init__(registry: ModuleInstanceRegistry): void {
    return;
  }
  /* tslint:enable:public-method-name */
}

export default Module;
