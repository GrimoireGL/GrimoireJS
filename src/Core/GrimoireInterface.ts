import GOMLTree from "./Node/GOMLTree";
import Constants from "./Base/Constants";
import IDObject from "./Base/IDObject";
import GOMLInterface from "./Node/GOMLInterface";

const _interfaceIDAttributeName = "x-interfaceID";

interface IGrimoireInterfaceBase {

    /**
     * Obtain the interface bounded to specified script tag.
     * @param  {HTMLScriptElement} tag [description]
     * @return {GOMLInterface}         [description]
     */
    treeFromTag(tag: HTMLScriptElement): GOMLTree;
    /**
     * Add pair of HTMLScriptElement and GOMLTree.
     * @param {HTMLScriptElement} tag   [description]
     * @param {GOMLInterface}     inter [description]
     */
    addTree(tag: HTMLScriptElement, tree: GOMLTree): void;
}

interface IGrimoireInterface extends IGrimoireInterfaceBase {
    (query: string): GOMLInterface;
}

class GrimoireInterfaceImpl implements IGrimoireInterfaceBase {
    private _interfaces: { [key: string]: GOMLInterface; };

    public treeFromTag(tag: HTMLScriptElement): GOMLInterface {
        const id = tag.getAttributeNS(Constants.defaultNamespace, _interfaceIDAttributeName);
        if (id && this._interfaces[id]) {
            return this._interfaces[id];
        } else {
            // TODO handle error
            return undefined;
        }
    }

    public addTree(tag: HTMLScriptElement, inter: GOMLInterface): void {
        const id = IDObject.getUniqueRandom(10);
        tag.setAttributeNS(Constants.defaultNamespace, _interfaceIDAttributeName, id);
        this._interfaces[id] = inter;
    }
}

const GrimoireInterface = <IGrimoireInterface>function(selector: string): GOMLInterface {
    return undefined; // TODO
};

// merge function and baseobject
const baseInstance = new GrimoireInterfaceImpl();
Object.assign(GrimoireInterface, baseInstance);

export default GrimoireInterface;
