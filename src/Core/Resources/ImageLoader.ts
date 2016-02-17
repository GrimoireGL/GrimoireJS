import AsyncLoader from "./AsyncLoader";
import Q from "q";
class ImageLoader {

  private static _loader: AsyncLoader<HTMLImageElement> = new AsyncLoader<HTMLImageElement>();

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
