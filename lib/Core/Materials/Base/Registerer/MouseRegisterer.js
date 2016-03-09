import Vector2 from "../../../../Math/Vector2";
import RegistererBase from "./RegistererBase";
class MouseRegisterer extends RegistererBase {
    getName() {
        return "builtin.mouse";
    }
    register(gl, pWrapper, matArg, uniforms) {
        if (uniforms["_mousePosition"]) {
            pWrapper.uniformVector("_mousePosition", new Vector2(matArg.renderer.mouseX, matArg.renderer.mouseY));
        }
    }
}
export default MouseRegisterer;
