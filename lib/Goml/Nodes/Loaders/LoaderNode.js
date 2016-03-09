import GomlTreeNodeBase from "../../GomlTreeNodeBase";
class LoaderNode extends GomlTreeNodeBase {
    constructor() {
        super();
        // this.loaderHTML = elem.innerHTML;
        this.loaderHTML = ""; // TODO: pnly
        this.attributes.defineAttribute({
            "name": {
                value: undefined,
                converter: "string",
                onchanged: this._onNameAttrChanged,
            }
        });
    }
    _onNameAttrChanged(attr) {
        this.nodeExport(this.attributes.getValue("name"));
        attr.done();
    }
}
export default LoaderNode;
