import ContextSafeContainer from "../ContextSafeResourceContainer";
import ShaderWrapper from "./ShaderWrapper";
import JThreeEvent from "../../../Base/JThreeEvent";
class Shader extends ContextSafeContainer {
    /**
     * コンストラクタ
     * (Should not be called by new,You should use CreateShader static method instead.)
     */
    constructor() {
        super();
        this._onUpdateEvent = new JThreeEvent();
        this.__initializeForFirst();
    }
    /**
     * シェーダークラスを作成する。
     */
    static createShader(source, shaderType) {
        const shader = new Shader();
        shader._shaderSource = source;
        shader._shaderType = shaderType;
        return shader;
    }
    /**
     * Shader Type
     * (VertexShader or FragmentShader)
     */
    get ShaderType() {
        return this._shaderType;
    }
    /**
     * Shader Source in text
     */
    get ShaderSource() {
        return this._shaderSource;
    }
    /**
     * Load all shaderWrappers
     */
    loadAll() {
        this.each((v) => {
            v.init();
        });
    }
    __createWrapperForCanvas(canvas) {
        return new ShaderWrapper(this, canvas);
    }
    /**
     * Update shader source code.
     * @param shaderSource new shader source code.
     */
    update(shaderSource) {
        this._shaderSource = shaderSource;
        this.each((v) => {
            v.update();
        });
        this._onUpdateEvent.fire(this, shaderSource);
    }
    /**
     * Register the handler to handle when shader source code is changed.
     * @param handler the handler for shader changing
     */
    onUpdate(handler) {
        this._onUpdateEvent.addListener(handler);
    }
}
export default Shader;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvcmUvUmVzb3VyY2VzL1NoYWRlci9TaGFkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sb0JBQW9CLE1BQU0saUNBQWlDO09BRTNELGFBQWEsTUFBTSxpQkFBaUI7T0FFcEMsV0FBVyxNQUFNLDJCQUEyQjtBQUNuRCxxQkFBcUIsb0JBQW9CO0lBT3ZDOzs7T0FHRztJQUNIO1FBQ0UsT0FBTyxDQUFDO1FBUkYsbUJBQWMsR0FBd0IsSUFBSSxXQUFXLEVBQVUsQ0FBQztRQVN0RSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxPQUFjLFlBQVksQ0FBQyxNQUFjLEVBQUUsVUFBa0I7UUFDM0QsTUFBTSxNQUFNLEdBQVcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUNwQyxNQUFNLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztRQUM5QixNQUFNLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUFXLFVBQVU7UUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUdEOztPQUVHO0lBQ0gsSUFBVyxZQUFZO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7SUFFRDs7T0FFRztJQUNJLE9BQU87UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNWLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVTLHdCQUF3QixDQUFDLE1BQWM7UUFDL0MsTUFBTSxDQUFDLElBQUksYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLFlBQW9CO1FBQ2hDLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFFBQVEsQ0FBQyxPQUFnQztRQUM5QyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzQyxDQUFDO0FBRUgsQ0FBQztBQUVELGVBQWUsTUFBTSxDQUFDIiwiZmlsZSI6IkNvcmUvUmVzb3VyY2VzL1NoYWRlci9TaGFkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29udGV4dFNhZmVDb250YWluZXIgZnJvbSBcIi4uL0NvbnRleHRTYWZlUmVzb3VyY2VDb250YWluZXJcIjtcbmltcG9ydCBDYW52YXMgZnJvbSBcIi4uLy4uL0NhbnZhcy9DYW52YXNcIjtcbmltcG9ydCBTaGFkZXJXcmFwcGVyIGZyb20gXCIuL1NoYWRlcldyYXBwZXJcIjtcbmltcG9ydCB7QWN0aW9uMn0gZnJvbSBcIi4uLy4uLy4uL0Jhc2UvRGVsZWdhdGVzXCI7XG5pbXBvcnQgSlRocmVlRXZlbnQgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvSlRocmVlRXZlbnRcIjtcbmNsYXNzIFNoYWRlciBleHRlbmRzIENvbnRleHRTYWZlQ29udGFpbmVyPFNoYWRlcldyYXBwZXI+IHtcblxuICBwcml2YXRlIF9zaGFkZXJTb3VyY2U6IHN0cmluZztcblxuICBwcml2YXRlIF9vblVwZGF0ZUV2ZW50OiBKVGhyZWVFdmVudDxzdHJpbmc+ID0gbmV3IEpUaHJlZUV2ZW50PHN0cmluZz4oKTtcblxuICBwcml2YXRlIF9zaGFkZXJUeXBlOiBudW1iZXI7XG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICogKFNob3VsZCBub3QgYmUgY2FsbGVkIGJ5IG5ldyxZb3Ugc2hvdWxkIHVzZSBDcmVhdGVTaGFkZXIgc3RhdGljIG1ldGhvZCBpbnN0ZWFkLilcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fX2luaXRpYWxpemVGb3JGaXJzdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOOCt+OCp+ODvOODgOODvOOCr+ODqeOCueOCkuS9nOaIkOOBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjcmVhdGVTaGFkZXIoc291cmNlOiBzdHJpbmcsIHNoYWRlclR5cGU6IG51bWJlcik6IFNoYWRlciB7XG4gICAgY29uc3Qgc2hhZGVyOiBTaGFkZXIgPSBuZXcgU2hhZGVyKCk7XG4gICAgc2hhZGVyLl9zaGFkZXJTb3VyY2UgPSBzb3VyY2U7XG4gICAgc2hhZGVyLl9zaGFkZXJUeXBlID0gc2hhZGVyVHlwZTtcbiAgICByZXR1cm4gc2hhZGVyO1xuICB9XG5cblxuICAvKipcbiAgICogU2hhZGVyIFR5cGVcbiAgICogKFZlcnRleFNoYWRlciBvciBGcmFnbWVudFNoYWRlcilcbiAgICovXG4gIHB1YmxpYyBnZXQgU2hhZGVyVHlwZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zaGFkZXJUeXBlO1xuICB9XG5cblxuICAvKipcbiAgICogU2hhZGVyIFNvdXJjZSBpbiB0ZXh0XG4gICAqL1xuICBwdWJsaWMgZ2V0IFNoYWRlclNvdXJjZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9zaGFkZXJTb3VyY2U7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCBhbGwgc2hhZGVyV3JhcHBlcnNcbiAgICovXG4gIHB1YmxpYyBsb2FkQWxsKCk6IHZvaWQge1xuICAgIHRoaXMuZWFjaCgodikgPT4ge1xuICAgICAgdi5pbml0KCk7XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX19jcmVhdGVXcmFwcGVyRm9yQ2FudmFzKGNhbnZhczogQ2FudmFzKTogU2hhZGVyV3JhcHBlciB7XG4gICAgcmV0dXJuIG5ldyBTaGFkZXJXcmFwcGVyKHRoaXMsIGNhbnZhcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHNoYWRlciBzb3VyY2UgY29kZS5cbiAgICogQHBhcmFtIHNoYWRlclNvdXJjZSBuZXcgc2hhZGVyIHNvdXJjZSBjb2RlLlxuICAgKi9cbiAgcHVibGljIHVwZGF0ZShzaGFkZXJTb3VyY2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX3NoYWRlclNvdXJjZSA9IHNoYWRlclNvdXJjZTtcbiAgICB0aGlzLmVhY2goKHYpID0+IHtcbiAgICAgIHYudXBkYXRlKCk7XG4gICAgfSk7XG4gICAgdGhpcy5fb25VcGRhdGVFdmVudC5maXJlKHRoaXMsIHNoYWRlclNvdXJjZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIGhhbmRsZXIgdG8gaGFuZGxlIHdoZW4gc2hhZGVyIHNvdXJjZSBjb2RlIGlzIGNoYW5nZWQuXG4gICAqIEBwYXJhbSBoYW5kbGVyIHRoZSBoYW5kbGVyIGZvciBzaGFkZXIgY2hhbmdpbmdcbiAgICovXG4gIHB1YmxpYyBvblVwZGF0ZShoYW5kbGVyOiBBY3Rpb24yPFNoYWRlciwgc3RyaW5nPik6IHZvaWQge1xuICAgIHRoaXMuX29uVXBkYXRlRXZlbnQuYWRkTGlzdGVuZXIoaGFuZGxlcik7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGFkZXI7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
