import Q = require("q");
class ImageLoader {

  private static _loadedTextures: { [url: string]: HTMLImageElement|Q.IPromise<HTMLImageElement> } = {};

  public static loadImage(src: string): Q.IPromise<HTMLImageElement> {
    const absPath = ImageLoader._getAbsolutePath(src);
    if (ImageLoader._loadedTextures[absPath] && typeof ImageLoader._loadedTextures[absPath]["then"] === "function") { // Assume this is Promise object
      return <Q.IPromise<HTMLImageElement>>ImageLoader._loadedTextures[absPath];
    } else {
      const deferred = Q.defer<HTMLImageElement>();
      if (ImageLoader._loadedTextures[absPath]) { // Assume this is loaded texture
        process.nextTick(() => {
          deferred.resolve(<HTMLImageElement>ImageLoader._loadedTextures[absPath]);
        });
      }else {
       const imgTag = new Image();
       imgTag.onload = () => {
        ImageLoader._loadedTextures[absPath] = imgTag;
        deferred.resolve(imgTag);
       };
       imgTag.onerror = (e) => {
        deferred.reject(e);
       };
       imgTag.src = src;
       ImageLoader._loadedTextures[absPath] = deferred.promise;
      }
      return deferred.promise;
    }
  }

  /**
   * Convert relative path to absolute path
   * @param  {string} relative relative path to be converted
   * @return {string}          converted absolute path
   */
  private static _getAbsolutePath(relative: string): string {
    const aElem = document.createElement("a");
    aElem.href = relative;
    return aElem.href;
  }
}

export = ImageLoader;
