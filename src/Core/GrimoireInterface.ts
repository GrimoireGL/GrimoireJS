import NamespacedIdentity from "./Base/NamespacedIdentity";
import GOMLInterface from "./Node/GOMLInterface";

interface IGrimoireInterfaceBase {
    ns(ns: string): (name: string) => NamespacedIdentity;
}

interface IGrimoireInterface extends IGrimoireInterfaceBase {
    (query: string): GOMLInterface;
}

class GrimoireInterfaceImpl implements IGrimoireInterfaceBase {
    public ns(ns: string): (name: string) => NamespacedIdentity {
        return (name: string) => new NamespacedIdentity(ns, name);
    }
}

const GrimoireInterface = <IGrimoireInterface>function(selector: string): GOMLInterface {
    return undefined; // TODO
};

// merge function and baseobject
const baseInstance = new GrimoireInterfaceImpl();
Object.assign(GrimoireInterface, baseInstance);

export default GrimoireInterface;
