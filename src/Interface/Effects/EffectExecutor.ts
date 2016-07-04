import IOption from "./IOption";
import EffectModule from "./EffectModule";
import Context from "../../Context";
import ModuleManager from "../../Module/ModuleManager";
import ContextComponents from "../../ContextComponents";
import GomlTreeNodeBase from "../../Goml/GomlTreeNodeBase";

class EffectExecutor {
  private _queue: (() => EffectModule<any>)[][] = [];
  /**
   * Now executing modules. This array will be sorted by priority of appearance.
   * @type {EffectModule[]}
   */
  private _executing: EffectModule<any>[] = [];
  private _moduleManager: ModuleManager;
  private _node: GomlTreeNodeBase;

  constructor(node: GomlTreeNodeBase) {
    this._moduleManager = Context.getContextComponent<ModuleManager>(ContextComponents.ModuleManager);
    this._node = node;
  }

  public add(properties: {[key: string]: string}, option: IOption): void {
    const moduleFactories = Object.keys(properties).map((property, i) => {
      const moduleFactory = () => {
        const moduleRegistry = this._moduleManager.addModule(<any>EffectModule);
        const moduleInstance = <EffectModule<any>>moduleRegistry.apply(this._node, property, properties[property], option);
        moduleInstance.afterDetach = () => {
          // _executingから削除
          const index = this._executing.indexOf(moduleInstance);
          if (index === -1) {
            throw new Error("executing module is not found");
          }
          this._executing.splice(index, 1);
          // 非表示になっていた同一propertyの実行中のmoduleの中で一番古いものを表示
          for (let j = 0; j <= this._executing.length - 1; j++) {
            if (this._executing[j].property === moduleInstance.property) {
              this._executing[j].appeared = true;
              break;
            }
          }
          if (i === Object.keys(properties).length - 1) {
            // 最後にcampleteを呼ぶ
            option.complete.call(this._node, this._node);
            // queue経由の場合は一番古いmoduleを実行
            if (moduleInstance.option.queue && this._queue.length !== 0) {
              const nextModules = this._queue.shift();
              nextModules.forEach((mf) => this._exec(mf()));
            }
          }
        };
        return moduleInstance;
      };
      return moduleFactory;
    });
    if (option.queue) {
      if (this._queue.length === 0 && this._executing.every((m) => !m.option.queue)) {
        // queueに一つも無い、かつすべての実行中のmoduleがqueue経由ではない場合には即時実行
        moduleFactories.forEach((mf) => this._exec(mf()));
      } else {
        // それ以外の場合はqueueへ
        this._queue.push(moduleFactories);
      }
    } else {
      // queue経由では無い場合は即時実行
      moduleFactories.forEach((mf) => this._exec(mf()));
    }
  }

  private _exec(module: EffectModule<any>): void {
    // console.log("exec", new Date, module.property, module);
    // 既に実行中のmoduleが同一propertyの場合、すべて非表示に
    this._executing.filter((m) => {
      return m.property === module.property;
    }).forEach((m) => {
      m.appeared = false;
    });
    // 新しいmoduleを実行開始
    this._executing.unshift(module);
    module.enabled = true;
  }
}

export default EffectExecutor;
