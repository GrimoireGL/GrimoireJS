interface IResourceLoaderEventArgs {
  hasNoError: boolean;
  erroredResource: number;
  loadedResource: number;
  completedResource: number;
  lastLoadMessage: string;
  resourceCount: number;
}

export default IResourceLoaderEventArgs;
