import NamespacedIdentity from "./Base/NamespacedIdentity";
import GOMLInterface from "./Node/GOMLInterface";

interface IGrimoireInterfaceBase {
    ns(ns: string): (name: string) => NamespacedIdentity;

    // TODO any should be replaced with Component object
    registerComponent(name: string, ctor: new () => any);
    registerComponent(nameObject: NamespacedIdentity, ctor: new () => any);
    registerComponent(name: string, obj: Object);
    registerComponent(nameObject: NamespacedIdentity, obj: Object);
    registerComponent(name: string | NamespacedIdentity, obj: Object | (new () => any));
}

interface IGrimoireInterface extends IGrimoireInterfaceBase {
    (query: string): GOMLInterface;
}

class GrimoireInterfaceImpl implements IGrimoireInterfaceBase {
    /**
     * Generate namespace helper function
     * @param  {string} ns namespace URI to be used
     * @return {[type]}    the namespaced identity
     */
    public ns(ns: string): (name: string) => NamespacedIdentity {
        return (name: string) => new NamespacedIdentity(ns, name);
    }

    public registerComponent(name: string, ctor: new () => any);
    public registerComponent(nameObject: NamespacedIdentity, ctor: new () => any);
    public registerComponent(name: string, obj: Object);
    public registerComponent(nameObject: NamespacedIdentity, obj: Object);
    public registerComponent(name: string | NamespacedIdentity, obj: Object | (new () => any)) {
        const nsObj = this._ensureTobeNamespacedIdentity(name);
    }


    private _ensureTobeNamespacedIdentity(name: string | NamespacedIdentity): NamespacedIdentity {
        if (typeof name === "string") {
            return new NamespacedIdentity(name);
        } else {
            return name;
        }
    }
}

// TODO export as IGrimoireInterface
export default new GrimoireInterfaceImpl();
