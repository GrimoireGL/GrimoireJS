interface IRenderStageRendererConfigure {
  cullOrientation: string;
  depthEnabled: boolean;
  depthMode: string;
  blendEnabled: boolean;
  blendSrcFactor: string;
  blendDstFactor: string;
  redMask: boolean;
  blueMask: boolean;
  greenMask: boolean;
  alphaMask: boolean;
  depthMask: boolean;
}

export = IRenderStageRendererConfigure;
