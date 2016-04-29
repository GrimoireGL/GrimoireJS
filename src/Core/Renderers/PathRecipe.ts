interface PathRecipe {
  buffers: {
    [name: string]: string
  };
  stage: string;
  variables?: {};
}
export default PathRecipe;
