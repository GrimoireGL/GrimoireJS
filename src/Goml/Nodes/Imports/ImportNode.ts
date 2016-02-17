import GomlTreeNodeBase from "../../GomlTreeNodeBase";
import MaterialManager from "../../../Core/Materials/Base/MaterialManager";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
import GomlAttribute from "../../GomlAttribute";

class ImportNode extends GomlTreeNodeBase {
  private materialManager: MaterialManager;

  private type: string = null;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "type": {
        value: undefined,
        converter: "string",
        onchanged: this._onTypeAttrChanged.bind(this),
      },
      "src": {
        value: undefined,
        converter: "string",
        onchanged: this._onSrcAttrChanged.bind(this),
      }
    });
    this.materialManager = JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
  }


  protected onMount(): void {
    super.onMount();
  }

  private _onTypeAttrChanged(attr: GomlAttribute): void {
    if (["material"].indexOf(attr.Value) !== -1) {
      this.type = attr.Value;
      attr.done();
    } else {
      throw new Error(`Unknown type: ${attr.Value}`);
    }
  }

  private _onSrcAttrChanged(attr: GomlAttribute): void {
    const path: string = attr.Value;
    if (!this.type) {
      switch (path.match(/\.(\w+?)$/)[1]) {
        case "xmml":
          this.type = "material";
          break;
      }
    }
    if (this.type) {
      this._getImport(path, attr.done.bind(attr));
    }
  }

  private _getImport(path: string, done: () => void): void {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path, true);
    xhr.setRequestHeader("Accept", "text");
    xhr.onload = () => {
      if (xhr.status === 200) {
        let exportName = null;
        switch (this.type) {
          case "material":
            const matName = this.materialManager.registerMaterial(xhr.responseText);
            exportName = `material-${matName}`;
            break;
        }
        this.nodeExport(exportName);
      }
      done();
    };
    xhr.onerror = (err) => {
      console.error(err);
      done();
    };
    xhr.send(null);
  }
}

export default ImportNode;
