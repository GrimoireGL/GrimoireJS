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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvTG9vcE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQ08saUJBQWlCLE1BQU0sc0JBQXNCO0FBMEJwRDs7Ozs7R0FLRztBQUNIO0lBaUJFOztPQUVHO0lBQ0g7UUFYQTs7Ozs7V0FLRztRQUNLLGlCQUFZLEdBQWlCLEVBQUUsQ0FBQztRQU10QyxJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBRSwwREFBMEQ7O29CQUV0Rjt3QkFDRSxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdEQsQ0FBQzs7b0JBRUQ7d0JBQ0UsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7b0JBQ3RELENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUs7UUFDVixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksU0FBUyxDQUFDLEtBQWEsRUFBRSxNQUFlO1FBQzdDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ3JCLEtBQUssRUFBRSxLQUFLO1lBQ1osTUFBTSxFQUFFLE1BQU07U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVNLHdCQUF3QjtRQUM3QixNQUFNLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssS0FBSztRQUNYLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUc7WUFDM0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDO0FBQ0gsQ0FBQztBQUVELGVBQWUsV0FBVyxDQUFDIiwiZmlsZSI6IkNvcmUvTG9vcE1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSUNvbnRleHRDb21wb25lbnQgZnJvbSBcIi4uL0lDb250ZXh0Q29tcG9uZW50XCI7XG5pbXBvcnQgQ29udGV4dENvbXBvbmVudHMgZnJvbSBcIi4uL0NvbnRleHRDb21wb25lbnRzXCI7XG5pbXBvcnQge0FjdGlvbjB9IGZyb20gXCIuLi9CYXNlL0RlbGVnYXRlc1wiO1xuLyoqXG4gKiBUaGUgc2V0IG9mIHByb3BlcnRpZXMgZm9yIGxvb3AgYWN0aW9uIHdoaWNoIHdpbGwgYmUgZXhlY3V0ZWQgaW4gTG9vcE1hbmFnZXJcbiAqXG4gKiDjg6vjg7zjg5fjg57jg43jg7zjgrjjg6Pjg7zjgavjgojjgorlrp/ooYzjgZXjgozjgovjgqLjgq/jgrfjg6fjg7Pjga7jgrvjg4Pjg4hcbiAqIEB0eXBlIHtbdHlwZV19XG4gKi9cbmludGVyZmFjZSBMb29wQWN0aW9uIHtcbiAgLyoqXG4gICAqIE9yZGVyIGZvciBleGVjdXRpbmcuIFRoZSBsZXNzIHRoaXMgbnVtYmVyLHRoZSBtb3JlIGJlaW5nIGV4ZWN1dGVkIGluIGVhcmx5IG9yZGVyLlxuICAgKlxuICAgKiDlrp/ooYzpoIbluo/jgIHjgZPjga7nlarlj7fjgYzkvY7jgZHjgozjgbDkvY7jgYTjgbvjganjgIHlrp/ooYzjgr/jgqTjg5/jg7PjgrDjgYzml6njgYTjgIJcbiAgICogQHR5cGUge251bWJlcn1cbiAgICovXG4gIG9yZGVyOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZC5cbiAgICpcbiAgICog5a6f6KGM44GV44KM44KL6Zai5pWwXG4gICAqIEB0eXBlIHtBY3Rpb24wfVxuICAgKi9cbiAgYWN0aW9uOiBBY3Rpb24wO1xufVxuXG4vKipcbiAqIFRoZSBjbGFzcyB0byBwcm92aWRlIGFsbCBvZiBsb29wIGFjdGlvbiBzdHVmZiBpbiBKVGhyZWUuXG4gKlxuICogSlRocmVl5YaF44Gu44Or44O844OX44Gr6Zai44GZ44KL5qmf6IO944KS5o+Q5L6b44GZ44KL44Kv44Op44K5XG4gKiBAdHlwZSB7W3R5cGVdfVxuICovXG5jbGFzcyBMb29wTWFuYWdlciBpbXBsZW1lbnRzIElDb250ZXh0Q29tcG9uZW50IHtcbiAgLyoqXG4gICAqIFRoZSBmdW5jdGlvbiB0byByZWdpc3RlciBuZXh0IGxvb3AgY2FsbGluZyBpbiBuZXh0IGZyYW1lLlxuICAgKlxuICAgKiDmrKHjga7jg5Xjg6zjg7zjg6Djgafjga7jg6vjg7zjg5fplqLmlbDjga7lkbzjgbPlh7rjgZfjgpLnmbvpjLLjgZnjgovplqLmlbBcbiAgICogQHR5cGUge1t0eXBlXX1cbiAgICovXG4gIHByaXZhdGUgX3JlZ2lzdGVyTmV4dExvb3A6IEFjdGlvbjA7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGxvb3AgYWN0aW9ucyBhbHJlYWR5IHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIOaXouOBq+eZu+mMsuOBleOCjOOBn+ODq+ODvOODl+OCouOCr+OCt+ODp+ODs+OBruODquOCueODiFxuICAgKiBAdHlwZSB7TG9vcEFjdGlvbltdfVxuICAgKi9cbiAgcHJpdmF0ZSBfbG9vcEFjdGlvbnM6IExvb3BBY3Rpb25bXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fcmVnaXN0ZXJOZXh0TG9vcCA9XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAgLy8gaWYgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSBpcyBkZWZpbmVkIG9yIHVuZGVmaW5lZFxuICAgICAgP1xuICAgICAgKCkgPT4geyAvLyBXaGVuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgaXMgc3VwcG9ydGVkXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fbG9vcC5iaW5kKHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIDpcbiAgICAgICgpID0+IHsgLy8gV2hlbiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMuX2xvb3AuYmluZCh0aGlzKSwgMTAwMCAvIDYwKTtcbiAgICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQmVnaW4gdGhlIGxvb3BcbiAgICovXG4gIHB1YmxpYyBiZWdpbigpOiB2b2lkIHtcbiAgICB0aGlzLl9sb29wKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFjdGlvbiB0byBiZSBsb29wZWQuXG4gICAqXG4gICAqIOOCouOCr+OCt+ODp+ODs+OCkuODq+ODvOODl+OBleOCjOOCi+OCiOOBhui/veWKoOOBl+OBvuOBmeOAglxuICAgKiBAcGFyYW0gIHtudW1iZXJ9ICAgICAgICAgICBvcmRlciAgdGhlIGV4ZWN1dGlvbiBvcmRlciB3aGVyZSBpcyBjcml0ZXJpYSBmb3IgcHJpb3J0eSBvZiBsb29wLlxuICAgKiBAcGFyYW0gIHtBY3Rpb24wfSBhY3Rpb24gdGhlIGZ1bmN0aW9uIHdoZXJlIHdpbGwgYmUgZXhlY3V0ZWQgaW4gdGhlIGxvb3BcbiAgICovXG4gIHB1YmxpYyBhZGRBY3Rpb24ob3JkZXI6IG51bWJlciwgYWN0aW9uOiBBY3Rpb24wKTogdm9pZCB7XG4gICAgdGhpcy5fbG9vcEFjdGlvbnMucHVzaCh7XG4gICAgICBvcmRlcjogb3JkZXIsXG4gICAgICBhY3Rpb246IGFjdGlvblxuICAgIH0pO1xuICAgIHRoaXMuX2xvb3BBY3Rpb25zLnNvcnQoKGExLCBhMikgPT4gYTEub3JkZXIgLSBhMi5vcmRlcik7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29udGV4dENvbXBvbmVudEluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIENvbnRleHRDb21wb25lbnRzLkxvb3BNYW5hZ2VyO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBmcmFtZSBmb3IgbG9vcFxuICAgKlxuICAgKiDjg6vjg7zjg5fjga4x44OV44Os44O844Og44KS5a6f6KGMXG4gICAqL1xuICBwcml2YXRlIF9sb29wKCk6IHZvaWQge1xuICAgIHRoaXMuX2xvb3BBY3Rpb25zLmZvckVhY2goYWN0ID0+IHtcbiAgICAgIGFjdC5hY3Rpb24oKTtcbiAgICB9KTtcbiAgICB0aGlzLl9yZWdpc3Rlck5leHRMb29wKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9vcE1hbmFnZXI7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
