import RegistererBase from "./RegistererBase";
class StageDescriptionRegisterer extends RegistererBase {
    getName() {
        return "builtin.stageInfo";
    }
    register(gl, pWrapper, matArg, uniforms) {
        if (uniforms["_techniqueIndex"]) {
            pWrapper.uniformInt("_techniqueIndex", matArg.techniqueIndex);
        }
        if (uniforms["_passIndex"]) {
            pWrapper.uniformInt("_passIndex", matArg.passIndex);
        }
        if (uniforms["_techniqueCount"]) {
            pWrapper.uniformInt("_techniqueCount", matArg.techniqueCount);
        }
        if (uniforms["_passCount"]) {
            pWrapper.uniformInt("_passCount", matArg.passCount);
        }
    }
}
export default StageDescriptionRegisterer;
