import jThreeObject from "../Base/JThreeObject";
import {InvalidArgumentException} from "../Exceptions";
import JThreeLogger from "../Base/JThreeLogger";
import GomlParser from "./GomlParser";
import NodeManager from "./NodeManager";
import JThreeContext from "../JThreeContext";
import ResourceLoader from "../Core/ResourceLoader";
import ContextComponent from "../ContextComponents";
import Q from "q";

/**
 * The class for loading goml.
 */
class GomlLoader extends jThreeObject {
  // public update() {
  //   if (!this.ready) return;
  //   if(this.gomlRoot)this.gomlRoot.callRecursive(v=>v.update());
  //   this.componentRunner.executeForAllBehaviors("updateBehavior");
  // }

  /**
   * Constructor. User no need to call this constructor by yourself.
   */
  constructor(nodeManager: NodeManager, selfTag: HTMLScriptElement) {
    super();
    // obtain the script tag that is refering this source code.
    this.selfTag = selfTag;
    this.nodeManager = nodeManager;
    const resourceLoader = JThreeContext.getContextComponent<ResourceLoader>(ContextComponent.ResourceLoader);
    this.gomlLoadingDeferred = resourceLoader.getResourceLoadingDeffered<void>();
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
  private nodeManager: NodeManager;

  /**
   * The script tag that is refering this source code.
   */
  private selfTag: HTMLScriptElement;

  private gomlLoadingDeferred: Q.Deferred<void>;

  /**
   * Attempt to load GOMLs that placed in HTML file.
   */
  public initForPage(): void {
    JThreeLogger.sectionLog("Goml loader", "Goml initialization was started.");
    // to load <script src="j3.js" x-goml="HERE"/>
    this.attemptToLoadGomlInScriptAttr();
    // to load the script that is type of text/goml
    const gomls: NodeList = document.querySelectorAll("script[type=\'text/goml\']");
    for (let i = 0; i < gomls.length; i++) {
      this.loadScriptTag(<HTMLElement>gomls[i]);
    }
  }

  /**
   * Load goml script for current jthree v3 syntax.
   *
   * Attempt to load x-goml attribute from script tag refering this source.
   * <script x-goml='path/to/goml'></script>
   */
  private attemptToLoadGomlInScriptAttr(): void {
    const url: string = this.selfTag.getAttribute("x-goml");
    if (!url) {
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      this.scriptLoaded((new DOMParser()).parseFromString(xhr.response, "text/xml").documentElement);
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
  private loadScriptTag(scriptTag: HTMLElement): void {
    const srcSource: string = scriptTag.getAttribute("src"),
      xhr = new XMLHttpRequest();
    if (srcSource) { // when src is specified
      // use xhr to get script of src
      xhr.addEventListener("load", () => {
        this.scriptLoaded((new DOMParser()).parseFromString(xhr.response, "text/xml").documentElement);
      });
      xhr.open("GET", srcSource);
      xhr.responseType = "text";
      xhr.send();
    } else { // when src is not specified
      // get innerText of script tag
      this.scriptLoaded(<HTMLElement>scriptTag.childNodes[0]);
    }
  }

  /**
   * parse goml source to node tree and load each node
   *
   * @param {HTMLElement} source goml source
   */
  private scriptLoaded(source: HTMLElement): void {
    const catched = this.nodeManager.htmlRoot = source;
    if (catched.children[0].tagName.toUpperCase() === "PARSERERROR") {
      JThreeLogger.sectionError("Goml loader", `Invalid Goml was passed. Parsing goml was aborted. Error code will be appear below`);
      JThreeLogger.sectionLongLog("Goml loader", catched.innerHTML);
    }
    if (catched === undefined || catched.tagName.toUpperCase() !== "GOML") {
      throw new InvalidArgumentException("Root should be goml");
    }
    const parsedNode = GomlParser.parse(source, this.nodeManager.configurator);
    parsedNode.Mounted = true;
    this.nodeManager.gomlRoot = parsedNode;
    JThreeLogger.sectionLog("Goml loader", `Goml loading was completed`);
    this.nodeManager.ready = true;
    this.nodeManager.attributePromiseRegistry.async(() => {
      // onfullfilled
      console.log("all attribute initialized");
      this.gomlLoadingDeferred.resolve(null);
    });
  }
}

export default GomlLoader;
