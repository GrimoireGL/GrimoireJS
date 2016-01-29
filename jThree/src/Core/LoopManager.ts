import IContextComponent from "../IContextComponent";
import ContextComponents from "../ContextComponents";
import {Action0} from "../Base/Delegates";
/**
 * The set of properties for loop action which will be executed in LoopManager
 *
 * ループマネージャーにより実行されるアクションのセット
 * @type {[type]}
 */
interface LoopAction {
  /**
   * Order for executing. The less this number,the more being executed in early order.
   *
   * 実行順序、この番号が低ければ低いほど、実行タイミングが早い。
   * @type {number}
   */
  order: number;

  /**
   * The function to be executed.
   *
   * 実行される関数
   * @type {Action0}
   */
  action: Action0;
}

/**
 * The class to provide all of loop action stuff in JThree.
 *
 * JThree内のループに関する機能を提供するクラス
 * @type {[type]}
 */
class LoopManager implements IContextComponent {
  /**
   * The function to register next loop calling in next frame.
   *
   * 次のフレームでのループ関数の呼び出しを登録する関数
   * @type {[type]}
   */
  private _registerNextLoop;

  /**
   * The list of loop actions already registered.
   *
   * 既に登録されたループアクションのリスト
   * @type {LoopAction[]}
   */
  private _loopActions: LoopAction[] = [];

  /**
   * Constructor
   */
  constructor() {
    this._registerNextLoop =
    window.requestAnimationFrame  // if window.requestAnimationFrame is defined or undefined
      ?
      () => { // When window.requestAnimationFrame is supported
        window.requestAnimationFrame(this._loop.bind(this));
      }
      :
      () => { // When window.requestAnimationFrame is not supported.
        window.setTimeout(this._loop.bind(this), 1000 / 60);
      };
  }

  /**
   * Begin the loop
   */
  public begin(): void {
    this._loop();
  }

  /**
   * Add action to be looped.
   *
   * アクションをループされるよう追加します。
   * @param  {number}           order  the execution order where is criteria for priorty of loop.
   * @param  {Action0} action the function where will be executed in the loop
   */
  public addAction(order: number, action: Action0): void {
    this._loopActions.push({
      order: order,
      action: action
    });
    this._loopActions.sort((a1, a2) => a1.order - a2.order);
  }

  public getContextComponentIndex(): number {
    return ContextComponents.LoopManager;
  }

  /**
   * Execute a frame for loop
   *
   * ループの1フレームを実行
   */
  private _loop(): void {
    this._loopActions.forEach(act => {
      act.action();
    });
    this._registerNextLoop();
  }
}

export default LoopManager;
