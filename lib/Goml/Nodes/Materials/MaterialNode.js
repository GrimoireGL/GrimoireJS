import MaterialNodeBase from "./MaterialNodeBase";
class MaterialNode extends MaterialNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "type": {
                value: "builtin.phong",
                converter: "string",
                onchanged: this._onTypeAttrChanged,
            }
        });
    }
    __onMount() {
        super.__onMount();
    }
    _onTypeAttrChanged(attr) {
        let material = this.__getMaterialFromMatName(attr.Value);
        if (material) {
            this.__setMaterial(material, () => {
                attr.done();
            });
        }
        else {
            this.nodeImport("jthree.import", `material-${attr.Value}`, (node) => {
                if (node) {
                    material = this.__getMaterialFromMatName(attr.Value);
                    this.__setMaterial(material, () => {
                        attr.done();
                    });
                }
                attr.done();
            });
        }
    }
}
export default MaterialNode;
