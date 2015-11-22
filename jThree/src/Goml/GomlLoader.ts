import GomlTreeNodeBase = require("./GomlTreeNodeBase");
import jThreeObject = require("../Base/JThreeObject");
import Exceptions = require("../Exceptions");
import Delegates = require("../Base/Delegates");
import GomlNodeDictionary = require("./GomlNodeDictionary");
import JThreeEvent = require('../Base/JThreeEvent');
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import BehaviorRegistry = require("./Behaviors/BehaviorRegistry");
import GomlConfigurator = require('./GomlConfigurator');
import BehaviorRunner = require('./Behaviors/BehaviorRunner');
import JThreeLogger = require("../Base/JThreeLogger");
import JThreeInit = require("../Init");
import GomlParser = require("./GomlParser");
import NodeManager = require("./NodeManager");
declare function require(string): any;

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
  constructor(nodeManager:NodeManager) {
    super();
    //obtain the script tag that is refering this source code.
    var scriptTags = document.getElementsByTagName('script');
    this.selfTag = JThreeInit.SelfTag;
    this.nodeManager = nodeManager;
  }

  private nodeManager:NodeManager;

  /**
   * The script tag that is refering this source code.
   */
  private selfTag: HTMLScriptElement;

  /**
   * The event it will be called when GomlLoader complete loading
   *
   * @type {JThreeEvent<HTMLElement>}
   */
  private onLoadEvent: JThreeEvent<HTMLElement> = new JThreeEvent<HTMLElement>();

  /**
   * Call passed function if loaded GOML Document.
   *
   * @param {Delegates.Action2<any, HTMLElement>} act [description]
   */
  public onload(act: Delegates.Action2<any, HTMLElement>): void {
    this.onLoadEvent.addListener(act);
  }

  public componentRunner: BehaviorRunner = new BehaviorRunner();
  public ready: boolean = false;

  /**
   * Attempt to load GOMLs that placed in HTML file.
   */
  public initForPage(): void {
    JThreeLogger.sectionLog("Goml loader","Goml initialization was started.");
    // to load <script src="j3.js" x-goml="HERE"/>
    this.attemptToLoadGomlInScriptAttr();
    // to load the script that is type of text/goml
    var gomls: NodeList = document.querySelectorAll('script[type=\'text/goml\']');
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
    var url: string = this.selfTag.getAttribute('x-goml');
    if(!url)return;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      this.scriptLoaded((new DOMParser()).parseFromString(xhr.response, 'text/xml').documentElement);
    });
    xhr.open('GET', url);
    xhr.responseType = 'text'
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
    var srcSource: string = scriptTag.getAttribute('src'),
      xhr = new XMLHttpRequest();
    if (srcSource) { // when src is specified
      // use xhr to get script of src
      xhr.addEventListener('load', () => {
        this.scriptLoaded((new DOMParser()).parseFromString(xhr.response, 'text/xml').documentElement);
      });
      xhr.open('GET', srcSource);
      xhr.responseType = 'text'
      xhr.send();
    } else { // when src is not specified
      // get innerText of script tag
      this.scriptLoaded(<HTMLElement>scriptTag.childNodes[0]);
    }
  }

  private loadTags(top:GomlTreeNodeBase)
  {
    top.callRecursive((v) => (<GomlTreeNodeBase>v).beforeLoad());
    top.callRecursive((v) => (<GomlTreeNodeBase>v).Load());
    top.callRecursive((v) => (<GomlTreeNodeBase>v).afterLoad());
    top.callRecursive((v) => (<GomlTreeNodeBase>v).attributes.applyDefaultValue());
  }

  /**
   * parse goml source to node tree and load each node
   *
   * @param {HTMLElement} source goml source
   */
  private scriptLoaded(source: HTMLElement): void {
    var catched = this.nodeManager.htmlRoot = source;
    if(catched.children[0].tagName.toUpperCase() === "PARSERERROR")
    {
      JThreeLogger.sectionError('Goml loader',`Invalid Goml was passed. Parsing goml was aborted. Error code will be appear below`);
      JThreeLogger.sectionLongLog('Goml loader',catched.innerHTML);
    }
    if (catched === undefined || catched.tagName.toUpperCase() !== 'GOML') throw new Exceptions.InvalidArgumentException('Root should be goml');

    this.nodeManager.gomlRoot =GomlParser.parse(source,this.nodeManager.configurator)
    this.loadTags(this.nodeManager.gomlRoot);
    JThreeLogger.sectionLog("Goml loader", `Goml loading was completed`);
    this.onLoadEvent.fire(this, source);
    this.ready = true;
  }



}
export = GomlLoader;
