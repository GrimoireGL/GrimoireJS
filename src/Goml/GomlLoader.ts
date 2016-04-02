import jThreeObject from "../Base/JThreeObject";
import JThreeLogger from "../Base/JThreeLogger";
import NodeManager from "./NodeManager";
import JThreeContext from "../JThreeContext";
import ResourceLoader from "../Core/ResourceLoader";
import ContextComponent from "../ContextComponents";
import Q from "q";

/**
 * The class for loading goml.
 */
class GomlLoader extends jThreeObject {

  /**
   * Constructor. User no need to call this constructor by yourself.
   */
  constructor(nodeManager: NodeManager, selfTag: HTMLScriptElement) {
    super();
    // obtain the script tag that is refering this source code.
    this._selfTag = selfTag;
    this._nodeManager = nodeManager;
    const resourceLoader = JThreeContext.getContextComponent<ResourceLoader>(ContextComponent.ResourceLoader);
    this._gomlLoadingDeferred = resourceLoader.getResourceLoadingDeffered<void>();
    resourceLoader.promise.then(() => {
      console.log("load finished!!");
    }, undefined,
      (v) => {
        // console.log(`loading resource...${v.completedResource / v.resourceCount * 100}%`);
      });
  }

  /**
   * NodeManager instance
   * @type {NodeManager}
   */
  private _nodeManager: NodeManager;

  /**
   * The script tag that is refering this source code.
   */
  private _selfTag: HTMLScriptElement;

  private _gomlLoadingDeferred: Q.Deferred<void>;

  /**
   * Attempt to load GOMLs that placed in HTML file.
   */
  public initForPage(): void {
    JThreeLogger.sectionLog("Goml loader", "Goml initialization was started.");
    // to load <script src="j3.js" x-goml="HERE"/>
    this._attemptToLoadGomlInScriptAttr();
    // to load the script that is type of text/goml
    const gomls: NodeList = document.querySelectorAll("script[type=\'text/goml\']");
    for (let i = 0; i < gomls.length; i++) {
      this._loadScriptTag(<HTMLElement>gomls[i]);
    }
  }

  /**
   * Load goml script for current jthree v3 syntax.
   *
   * Attempt to load x-goml attribute from script tag refering this source.
   * <script x-goml='path/to/goml'></script>
   */
  private _attemptToLoadGomlInScriptAttr(): void {
    const url: string = this._selfTag.getAttribute("x-goml");
    if (!url) {
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      this._scriptLoaded((new DOMParser()).parseFromString(xhr.response, "text/xml").documentElement);
    });
    xhr.open("GET", url);
    xhr.responseType = "text";
    xhr.send();
  }

  /**
   * Load goml script for legacy jthree v2 syntax.
   *
   * Attempt to load src or innerText from script tag refering this source.
   * <script type='text/goml' src='path/to/goml'></script>
   * or
   * <script type='text/goml'>{{goml}}</script>
   *
   * @param {HTMLElement} scriptTag HTMLElement object of script tag
   */
  private _loadScriptTag(scriptTag: HTMLElement): void {
    const srcSource: string = scriptTag.getAttribute("src"),
      xhr = new XMLHttpRequest();
    if (srcSource) { // when src is specified
      // use xhr to get script of src
      xhr.addEventListener("load", () => {
        this._scriptLoaded((new DOMParser()).parseFromString(xhr.response, "text/xml").documentElement);
      });
      xhr.open("GET", srcSource);
      xhr.responseType = "text";
      xhr.send();
    } else { // when src is not specified
      for (let i = 0; i + 1 <= scriptTag.childNodes.length; i++) {
        const gomlElement = scriptTag.childNodes[i];
        if (gomlElement.nodeType === 3) {
          this._scriptLoaded((new DOMParser()).parseFromString(gomlElement.nodeValue, "text/xml").documentElement);
        }
      }
    }
  }

  /**
   * parse goml source to node tree and load each node
   *
   * @param {HTMLElement} source goml source
   */
  private _scriptLoaded(source: HTMLElement): void {
    this._nodeManager.setNodeToRootByElement(source, (err) => {
      if (err) {
        throw err;
      }
      // onfullfilled
      console.log("all attribute initialized");
      this._gomlLoadingDeferred.resolve(null);
    });
  }
}

export default GomlLoader;
