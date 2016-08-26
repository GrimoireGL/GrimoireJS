import Constants from "./Constants";
/**
 * The class to identity with XML namespace feature.
 */
class NSIdentity {
    /**
     * Namespace of this identity
     * @type {string}
     */
    public ns: string;

    /**
     * Short name for this identity
     * @type {string}
     */
    public name: string;

    /**
     * Full qualified name of this identity
     * @type {string}
     */
    public fqn: string;

    /**
     * Generate an instance from Full qualified name.
     * @param  {string}             fqn [description]
     * @return {NSIdentity}     [description]
     */
    public static fromFQN(fqn: string): NSIdentity {
        const splitted = fqn.split("|");
        if (splitted.length !== 2) {
            throw new Error("Invalid fqn was given");
        }
        return new NSIdentity(splitted[1], splitted[0]);
    }

    /**
     * Make sure given name is valid for using in identity.
     * | is prohibited for using in name or namespace.
     * . is prohibited for using in name.
     * All lowercase alphabet will be transformed into uppercase.
     * @param  {string} name        [A name to verify]
     * @param  {[type]} noDot=false [Ensure not using dot or not]
     * @return {string}             [Valid name]
     */
    private static _ensureValidIdentity(name: string, noDot = false): string {
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
        this.name = NSIdentity._ensureValidIdentity(this.name, true);
        this.ns = NSIdentity._ensureValidIdentity(this.ns);
        this.fqn = this.name + "|" + this.ns;
    }
}

export default NSIdentity;
