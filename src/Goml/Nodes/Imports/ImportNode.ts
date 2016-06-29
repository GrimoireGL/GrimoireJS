import GomlTreeNodeBase from "../../GomlTreeNodeBase";
import MaterialManager from "../../../Core/Materials/MaterialManager";
import GomlAttribute from "../../GomlAttribute";

class ImportNode extends GomlTreeNodeBase {

  private _type: string = null;

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
      },
      "src-selector": {
        value: undefined,
        converter: "string",
        onchanged: this._onSrcSelectorAttrChanged.bind(this),
      },
    });
  }


  protected __onMount(): void {
    super.__onMount();
  }

  private _onTypeAttrChanged(attr: GomlAttribute): void {
    if (["material"].indexOf(attr.Value) !== -1) {
      this._type = attr.Value;
      attr.done();
    } else {
      throw new Error(`Unknown type: ${attr.Value}`);
    }
  }

  private _onSrcAttrChanged(attr: GomlAttribute): void {
    const path: string = attr.Value;
    if (!this._type) {
      switch (path.match(/\.(\w+?)$/)[1]) {
        case "xmml":
          this._type = "material";
          break;
      }
    }
    if (this._type) {
      if (path) {
        this._getImportAjax(path, attr.done.bind(attr));
      } else if (this.attributes.getAttribute("src-selector").Value) {
        attr.done();
      } else {
        throw new Error("src of import is required");
      }
    }
  }

  private _onSrcSelectorAttrChanged(attr: GomlAttribute): void {
    if (attr.Value) {
      this._getImportSelector(attr.Value);
    }
    attr.done();
  }

  private _getImportAjax(path: string, done: () => void): void {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path, true);
    xhr.setRequestHeader("Accept", "text");
    xhr.onload = () => {
      if (xhr.status === 200) {
        this._attachImport(xhr.responseText);
      }
      done();
    };
    xhr.onerror = (err) => {
      console.error(err);
      done();
    };
    xhr.send(null);
  }

  private _getImportSelector(selector: string): void {
    const scriptTag = document.querySelector(selector);
    for (let i = 0; i + 1 <= scriptTag.childNodes.length; i++) {
      const importElement = scriptTag.childNodes[i];
      if (importElement.nodeType === 3) {
        this._attachImport(importElement.nodeValue);
      }
    }
  }

  private _attachImport(src: string): void {
    let exportName = null;
    switch (this._type) {
      case "material":
        const matName = MaterialManager.registerMaterial(src);
        exportName = `material-${matName}`;
        break;
    }
    this.nodeExport(exportName);
  }
}

export default ImportNode;
