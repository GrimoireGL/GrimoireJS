import NamespacedIdentity from "./Base/NamespacedIdentity";
import GOMLInterface from "./Node/GOMLInterface";
import NamespacedDictionary from "./Base/NamespacedDictionary";
import Ensure from "./Base/Ensure";
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

    public registerComponent(name: string, ctor: new () => any): void;
    public registerComponent(nameObject: NamespacedIdentity, ctor: new () => any): void;
    public registerComponent(name: string, obj: Object): void;
    public registerComponent(nameObject: NamespacedIdentity, obj: Object): void;
    public registerComponent(name: string | NamespacedIdentity, obj: Object | (new () => any)): void {
        // const nsObj = this._ensureTobeNamespacedIdentity(name);
    }

    public registerObject(name: string | NamespacedIdentity, requiredComponents: (string | NamespacedIdentity)[],
        defaultValues?: { [key: string]: any } | NamespacedDictionary<any>, inherits?: string | NamespacedIdentity, requiredComponentsForChildren?: (string | NamespacedIdentity)[]): void {
        name = Ensure.ensureTobeNamespacedIdentity(name);
        requiredComponents = Ensure.ensureTobeNamespacedIdentityArray(requiredComponents);
        defaultValues = Ensure.ensureTobeNamespacedDictionary<any>(defaultValues, (name as NamespacedIdentity).ns);
        inherits = Ensure.ensureTobeNamespacedIdentity(inherits);
        requiredComponentsForChildren = Ensure.ensureTobeNamespacedIdentityArray(requiredComponentsForChildren);

    }
}

// TODO export as IGrimoireInterface
export default new GrimoireInterfaceImpl();
