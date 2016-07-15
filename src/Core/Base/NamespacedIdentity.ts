import Constants from "./Constants";
/**
 * The class to identity with XML namespace feature.
 */
class NamespacedIdentity {
    public ns: string;

    public name: string;

    public fqn: string;

    public static fromFQN(fqn: string): NamespacedIdentity {
        const splitted = fqn.split("|");
        if (splitted.length !== 2) {
            throw new Error("Invalid fqn was given");
        }
        return new NamespacedIdentity(splitted[1], splitted[0]);
    }

    private static _ensureValidIdentity(name: string, noDot: boolean = false): string {
        if (name.indexOf("|") > -1) {
            throw new Error("Namespace and identity cannnot contain | ");
        }
        if (noDot && name.indexOf(".") > -1) {
            throw new Error("identity cannnot contain .");
        }
        if (name == null) {
            throw new Error("Specified name was null or undefined");
        }
        return name.toUpperCase();
    }

    constructor(name: string);
    constructor(ns: string, name: string);
    constructor(ns: string, name?: string) {
        if (name) {
            this.ns = ns;
            this.name = name;
        } else {
            this.ns = Constants.defaultNamespace;
            this.name = ns;
        }
        // Ensure all of the characters are uppercase
        this.name = NamespacedIdentity._ensureValidIdentity(this.name, true);
        this.ns = NamespacedIdentity._ensureValidIdentity(this.ns);
        this.fqn = this.name + "|" + this.ns;
    }
}

export default NamespacedIdentity;
