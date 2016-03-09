import AsyncLoader from "./AsyncLoader";
import Q from "q";
class ImageLoader {
    static loadImage(src) {
        return ImageLoader._loader.fetch(src, (path) => {
            const deferred = Q.defer();
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
ImageLoader._loader = new AsyncLoader();
export default ImageLoader;
