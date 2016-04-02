import CacheResolver from "./CacheResolver";
class BasicCacheResolver<T> extends CacheResolver<T> {
  public getIdentityName(name: string): string {
    return name;
  }
}
export default BasicCacheResolver;
