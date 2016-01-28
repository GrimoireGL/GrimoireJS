interface StageChainTemplate {
  buffers: {
    [name: string]: string
  };
  stage: string;
  variables?: {};
}
export default StageChainTemplate;
