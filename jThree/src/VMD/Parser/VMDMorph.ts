import VMDFrameData = require("./VMDFrameData");


interface VMDMorph extends VMDFrameData {
  frameNumber: number;
  morphValue: number;
}
export = VMDMorph;
