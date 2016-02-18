import VMDFrameData from "./VMDFrameData";
import BezierCurve from "./BezierCurve";
interface VMDMotion extends VMDFrameData {
  frameNumber: number;
  position: number[];
  rotation: number[];
  interpolation: BezierCurve[];
}

export default VMDMotion;
