import ContextComponents from "../ContextComponents";
/**
 * The class to provide all of loop action stuff in JThree.
 *
 * JThree内のループに関する機能を提供するクラス
 * @type {[type]}
 */
class LoopManager {
    /**
     * Constructor
     */
    constructor() {
        /**
         * The list of loop actions already registered.
         *
         * 既に登録されたループアクションのリスト
         * @type {LoopAction[]}
         */
        this._loopActions = [];
        this._registerNextLoop =
            window.requestAnimationFrame // if window.requestAnimationFrame is defined or undefined
                ?
                        () => {
                        window.requestAnimationFrame(this._loop.bind(this));
                    }
                :
                        () => {
                        window.setTimeout(this._loop.bind(this), 1000 / 60);
                    };
    }
    /**
     * Begin the loop
     */
    begin() {
        this._loop();
    }
    /**
     * Add action to be looped.
     *
     * アクションをループされるよう追加します。
     * @param  {number}           order  the execution order where is criteria for priorty of loop.
     * @param  {Action0} action the function where will be executed in the loop
     */
    addAction(order, action) {
        this._loopActions.push({
            order: order,
            action: action
        });
        this._loopActions.sort((a1, a2) => a1.order - a2.order);
    }
    getContextComponentIndex() {
        return ContextComponents.LoopManager;
    }
    /**
     * Execute a frame for loop
     *
     * ループの1フレームを実行
     */
    _loop() {
        this._loopActions.forEach(act => {
            act.action();
        });
        this._registerNextLoop();
    }
}
export default LoopManager;
