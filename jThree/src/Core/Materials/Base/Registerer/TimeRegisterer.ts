import Vector4 = require("../../../../Math/Vector4");
import JThreeContext = require("../../../../JThreeContext");
import ContextComponents = require("../../../../ContextComponents");
import Matrix = require("../../../../Math/Matrix");
import ProgramWrapper = require("../../../Resources/Program/ProgramWrapper");
import IVariableInfo = require("../IVariableInfo");
import IMaterialConfigureArgument = require("../IMaterialConfigureArgument");
import Timer = require("../../../Timer");
let v = 0;
const TimeRegisterer = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IMaterialConfigureArgument, uniforms: { [key: string]: IVariableInfo }) => {
    if (uniforms["_Time"]) {
        const timer:Timer = JThreeContext.getContextComponent<Timer>(ContextComponents.Timer);
        if(uniforms["_Time"].variableType == "float")
        {
          pWrapper.uniformFloat("_Time",v);
          v++;
        }else if(uniforms["_Time"].variableType == "vec4")
        {
          const time = timer.Time;
          pWrapper.uniformVector("_Time",new Vector4(time / 20, time, time * 2,time * 3));
        }
    }
}

export = TimeRegisterer;
