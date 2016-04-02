import CacheResovler from "./CacheResolver";
class ResourceResolver<T> extends CacheResovler<T> {
  public static getAbsolutePath(name: string): string {
    const aElem = document.createElement("a");
    aElem.href = name;
    return aElem.href;
  }

  public getIdentityName(name: string): string {
    return ResourceResolver.getAbsolutePath(name);
  }
}

export default ResourceResolver;
