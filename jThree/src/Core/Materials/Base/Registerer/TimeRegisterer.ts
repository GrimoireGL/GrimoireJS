import Vector4 = require("../../../../Math/Vector4");
import JThreeContext = require("../../../../JThreeContext");
import ContextComponents = require("../../../../ContextComponents");
import ProgramWrapper = require("../../../Resources/Program/ProgramWrapper");
import IVariableDescription = require("../IVariableDescription");
import IApplyMaterialArgument = require("../IApplyMaterialArgument");
import Timer = require("../../../Timer");
const TimeRegisterer = (gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: { [key: string]: IVariableDescription }) => {
    if (uniforms["_Time"]) {
        const timer: Timer = JThreeContext.getContextComponent<Timer>(ContextComponents.Timer);
        if (uniforms["_Time"].variableType === "float") {
            pWrapper.uniformFloat("_Time", timer.time);
        } else if (uniforms["_Time"].variableType === "vec4") {
            const time = timer.time;
            pWrapper.uniformVector("_Time", new Vector4(time / 20, time, time * 2, time * 3));
        }
    }
    if (uniforms["_SinTime"]) {
        const timer: Timer = JThreeContext.getContextComponent<Timer>(ContextComponents.Timer);
        if (uniforms["_SinTime"].variableType === "float") {
            pWrapper.uniformFloat("_SinTime", Math.sin(timer.time));
        } else if (uniforms["_SinTime"].variableType === "vec4") {
            const time = timer.time;
            pWrapper.uniformVector("_SinTime", new Vector4(Math.sin(time / 20.0), Math.sin(time), Math.sin(time * 2), Math.sin(time * 3)));
        }
    }
    if (uniforms["_CosTime"]) {
        const timer: Timer = JThreeContext.getContextComponent<Timer>(ContextComponents.Timer);
        if (uniforms["_CosTime"].variableType === "float") {
            const time = timer.time;
            pWrapper.uniformFloat("_CosTime", Math.cos(time));
        } else if (uniforms["_CosTime"].variableType === "vec4") {
            const time = timer.time;
            pWrapper.uniformVector("_CosTime", new Vector4(Math.cos(time / 20.0), Math.cos(time), Math.cos(time * 2), Math.cos(time * 3)));
        }
    }
};

export = TimeRegisterer;
