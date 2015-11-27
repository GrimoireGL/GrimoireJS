interface IResourceLoaderEventArgs
{
  hasNoError:boolean;
  erroredResource:number;
  loadedResource:number;
  completedResource:number;
  lastLoadMessage:string;
}

export = IResourceLoaderEventArgs;
