import ResourceResolver from "./ResourceResolver";
import Q from "q";
class ImageLoader {

  private static _loader: ResourceResolver<HTMLImageElement> = new ResourceResolver<HTMLImageElement>();

  public static loadImage(src: string): Q.IPromise<HTMLImageElement> {
    return ImageLoader._loader.fetch(src, (path) => {
      const deferred = Q.defer<HTMLImageElement>();
      const imgTag = new Image();
      imgTag.onload = () => {
        deferred.resolve(imgTag);
      };
      imgTag.onerror = (e) => {
        deferred.reject(e);
      };
      imgTag.src = src;
      return deferred.promise;
    });
  }
}

export default ImageLoader;
