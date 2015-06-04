import TagFactory = require("./Factories/TagFactory");
import GomlTreeNodeBase = require("./GomlTreeNodeBase");
import jThreeObject = require("../Base/JThreeObject");
import Exceptions = require("../Exceptions");
import Delegates = require("../Delegates");
import JQuery = require("jquery");
import GomlNodeDictionary = require("./GomlNodeDictionary");
import JThreeContext = require("../Core/JThreeContext");
import GomlNodeListElement = require("./GomlNodeListElement");
import AttributeConverterBase = require("./Converter/AttributeConverterBase");
import EasingFunctionBase = require("./Easing/EasingFunctionBase");
import JThreeEvent = require('../Base/JThreeEvent');
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import ModuleRegistry = require('./Module/ModuleRegistry');
import GomlLoaderConfigurator = require('./GomlLoaderConfigurator');
declare function require(string): any;
/**
* The class for loading goml.
*/
class GomlLoader extends jThreeObject {
  /**
  * Constructor. User no need to call this constructor by yourself.
  */
  constructor() {
    super();
    //obtain the script tag that is refering this source code.
    var scriptTags = document.getElementsByTagName('script');
    this.selfTag = scriptTags[scriptTags.length - 1];
  }

  /**
  * The script tag that is refering this source code.
  */
  private selfTag: HTMLScriptElement;

  /**
  * The event it will be called when GomlLoader complete loading.
  */
  private onLoadEvent: JThreeEvent<string> = new JThreeEvent<string>();

  /*
  * Call passed function if loaded GOML Document.
  */
  public onload(act: Delegates.Action2<any, string>): void {
    this.onLoadEvent.addListerner(act);
  }

  private configurator:GomlLoaderConfigurator=new GomlLoaderConfigurator();

  public get Configurator():GomlLoaderConfigurator
  {
    return this.configurator;
  }

  headTagsById: AssociativeArray<GomlTreeNodeBase> = new AssociativeArray<GomlTreeNodeBase>();

  bodyTagsById: AssociativeArray<GomlTreeNodeBase> = new AssociativeArray<GomlTreeNodeBase>();

  nodeDictionary: GomlNodeDictionary = new GomlNodeDictionary();

  moduleRegistry: ModuleRegistry = new ModuleRegistry();

  rootObj: JQuery;

  headRootNodes: GomlTreeNodeBase[] = [];

  bodyRootNodes: GomlTreeNodeBase[] = [];

  /**
  * Attempt to load GOMLs that placed in HTML file.
  */
  initForPage(): void {
    //to load <script src="j3.js" x-goml="HERE"/>
    this.attemptToLoadGomlInScriptAttr();
    //to load the script that is type of text/goml
    //TODO replace JQuery into native js interface.
    var gomls: JQuery = $("script[type='text/goml']");
    gomls.each((index: number, elem: Element) => {
      this.loadScriptTag($(elem));
    });
  }
  /**
  * Attempt to load x-goml attribute from script tag refering this source.
  */
  private attemptToLoadGomlInScriptAttr(): void {
    var url = this.selfTag.getAttribute('x-goml');
    $.get(url, [], (d) => {
      this.scriptLoaded(d);
    });
  }

  /**
  * For <script type='text/goml'>
  */
  private loadScriptTag(scriptTag: JQuery): void {
    var srcSource: string = scriptTag[0].getAttribute("src");
    if (srcSource) {//when src is specified
      $.get(srcSource, [], (d) => {
        this.scriptLoaded(d);
      });
    } else {
      this.scriptLoaded(scriptTag.text());
    }
  }

  private scriptLoaded(source: string): void {
    source = source.replace(/(head|body)>/g, "j$1>");//TODO Can be bug
    var catched = this.rootObj = $(source);
    if (catched[0].tagName !== "GOML") throw new Exceptions.InvalidArgumentException("Root should be goml");
    var headChild = catched.find("jhead").children();
    var bodyChild = catched.find("jbody").children();
    this.parseHead(null, headChild, (e) => {
      this.headRootNodes.push(e);
    });
    this.parseBody(null, bodyChild, (e) => {
      this.bodyRootNodes.push(e);
    });
    this.eachNode(v=> v.beforeLoad());
    this.eachNode(v=> v.Load());
    this.eachNode(v=> v.afterLoad());
    this.onLoadEvent.fire(this, source);
  }

  private eachNode(act: Delegates.Action1<GomlTreeNodeBase>) {
    this.headTagsById.forEach((v) => act(v));
    this.bodyTagsById.forEach((v) => act(v));
  }

  private parseHead(parent: GomlTreeNodeBase, child: JQuery, act: Delegates.Action1<GomlTreeNodeBase>): void {
    if (!child) return;
    console.log(child);
    for (var i = 0; i < child.length; i++) {
      var elem: HTMLElement = child[i];
      var tagFactory=this.configurator.getGomlTagFactory(elem.tagName)
      if (tagFactory) {
        var newNode = tagFactory.CreateNodeForThis(elem, this, parent);
        if (newNode == null) {
          console.warn("{0} tag was parsed,but failed to create instance. Skipped.".format(elem.tagName));
          continue;
        }
        elem.classList.add("x-j3-" + newNode.ID);
        elem.setAttribute('x-j3-id', newNode.ID);
        this.headTagsById.set(newNode.ID, newNode);
        if (parent != null) {
          parent.addChild(newNode);
        }
        act(newNode);
        this.parseHead(newNode, $(elem).children(), (e) => { });
      } else {
        console.warn("{0} was not parsed.".format(elem.tagName));
      }
    }
  }

  private parseBody(parent: GomlTreeNodeBase, child: JQuery, act: Delegates.Action1<GomlTreeNodeBase>): void {
    if (!child) return;
    for (var i = 0; i < child.length; i++) {
      var elem: HTMLElement = child[i];
      var tagFactory=this.configurator.getGomlTagFactory(elem.tagName)
      if (tagFactory) {
        var newNode = tagFactory.CreateNodeForThis(elem, this, parent);
        if (newNode == null) {
          console.warn("{0} tag was parsed,but failed to create instance. Skipped.".format(elem.tagName));
          continue;
        }
        this.bodyTagsById.set(newNode.ID, newNode);
        elem.classList.add("x-j3-" + newNode.ID)
        elem.setAttribute('x-j3-id', newNode.ID);
        act(newNode);
        if (parent != null) {
          parent.addChild(newNode);
        }
        this.parseBody(newNode, $(elem).children(), (e) => { });

      } else {
        console.warn("{0} was not parsed.".format(elem.tagName));
      }
    }
  }

  public appendChildren(jq: JQuery, parent: HTMLElement, parentInGoml?: GomlTreeNodeBase, loadedGoml?: GomlTreeNodeBase[]): void {
    var needLastProcess = false;
    if (!jq) return;
    if (!parentInGoml) {
      var id = parent.getAttribute("x-j3-id");
      parentInGoml = this.bodyTagsById.get(id);
      needLastProcess = true;
      loadedGoml = [];
    }
    for (var i = 0; i < jq.length; i++) {
      var e = jq[i];
      var tagFactory=this.configurator.getGomlTagFactory(e.tagName)
      if (tagFactory) {
        var newNode = tagFactory.CreateNodeForThis(e, this, parentInGoml);
        if (newNode == null) {
          console.warn("{0} tag was parsed,but failed to create instance. Skipped.".format(e.tagName));
        } else {
          this.bodyTagsById.set(newNode.ID, newNode);
          e.classList.add("x-j3-" + newNode.ID)
          e.setAttribute('x-j3-id', newNode.ID);
          if (parent != null) {
            parentInGoml.addChild(newNode);
          }
          loadedGoml.push((newNode));
          this.appendChildren($(e).children(), null, newNode, loadedGoml);
        }

      } else {
        console.warn("{0} was not parsed.".format(e.tagName));
      }

    }
    if (needLastProcess) {
      loadedGoml.forEach((e) => {
        e.beforeLoad();
      });
      loadedGoml.forEach((e) => {
        e.Load();
      });
      loadedGoml.forEach((e) => {
        e.afterLoad();
      });
    }
  }

  public getNode(id: string): GomlTreeNodeBase {
    if (this.headTagsById.has(id)) return this.headTagsById.get(id);
    if (this.bodyTagsById.has(id)) return this.bodyTagsById.get(id);
    return null;
  }
}
export = GomlLoader;
