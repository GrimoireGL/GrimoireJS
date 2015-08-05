import GomlTreeNodeBase = require("./GomlTreeNodeBase");
import jThreeObject = require("../Base/JThreeObject");
import Exceptions = require("../Exceptions");
import Delegates = require("../Base/Delegates");
import $ = require("jquery");
import GomlNodeDictionary = require("./GomlNodeDictionary");
import JThreeEvent = require("../Base/JThreeEvent");
import AssociativeArray = require("../Base/Collections/AssociativeArray");
import ComponentRegistry = require("./Components/ComponentRegistry");
import GomlLoaderConfigurator = require("./GomlLoaderConfigurator");
import ComponentRunner = require("./Components/ComponentRunner");
import PluginLoader = require("./Plugins/PluginLoader");
declare function require(string): any;
/**
* The class for loading goml.
*/
class GomlLoader extends jThreeObject {

  private pluginLoader: PluginLoader = new PluginLoader();
  update() {
    if (!this.ready) return;
    this.componentRunner.executeForAllComponents("update");
  }
  /**
  * Constructor. User no need to call this constructor by yourself.
  */
  constructor() {
    super();
    //obtain the script tag that is refering this source code.
    var scriptTags = document.getElementsByTagName("script");
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

  /**
  * this configurator will load any tag information by require
  */
  private configurator: GomlLoaderConfigurator = new GomlLoaderConfigurator();

  /**
  * The configurator for new tag,converter,easingfunctions
  */
  public get Configurator(): GomlLoaderConfigurator {
    return this.configurator;
  }

  nodeRegister: GomlNodeDictionary = new GomlNodeDictionary();

  componentRegistry: ComponentRegistry = new ComponentRegistry();

  componentRunner: ComponentRunner = new ComponentRunner();

  rootObj: JQuery;

  rootNodes: AssociativeArray<GomlTreeNodeBase[]> = new AssociativeArray<GomlTreeNodeBase[]>();

  NodesById: AssociativeArray<GomlTreeNodeBase> = new AssociativeArray<GomlTreeNodeBase>();

  ready: boolean = false;
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
    var url = this.selfTag.getAttribute("x-goml");
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
    var catched = this.rootObj = $(source);
    if (catched[0].tagName !== "GOML") throw new Exceptions.InvalidArgumentException("Root should be goml");
    //generate node tree
    var children = catched.find("plugins").children();
    this.rootNodes.set("plugins", []);
    var pluginRequest = [];
    children.each((i,e)=>{
      if(e.tagName!=="PLUGIN")return;
      pluginRequest.push({
        id:e.getAttribute("id"),
        versionId:e.getAttribute("version")
      });
    });
    this.pluginLoader.resolvePlugins(pluginRequest, () => {
      this.configurator.GomlRootNodes.forEach(v=> {
        var children = catched.find(v).children();
        this.rootNodes.set(v, []);
        this.parseChildren(null, children, (e) => {
          this.rootNodes.get(v).push(e);
        })
      });
      this.eachNode(v=> v.beforeLoad());
      this.eachNode(v=> v.Load());
      this.eachNode(v=> v.afterLoad());
      this.eachNode(v=> v.attributes.applyDefaultValue());
      this.onLoadEvent.fire(this, source);
      this.ready = true;
    });
  }

  private eachNode(act: Delegates.Action1<GomlTreeNodeBase>, targets?: GomlTreeNodeBase[]) {
    if (targets) {
      targets.forEach(v=> {
        v.callRecursive(act);
      });
      return;
    }
    this.configurator.GomlRootNodes.forEach(v=> {
      this.rootNodes.get(v).forEach(e=> e.callRecursive(act));
    });
  }

  private parseChildren(parent: GomlTreeNodeBase, child: JQuery, actionForChildren: Delegates.Action1<GomlTreeNodeBase>): void {
    if (!child) return;//if there child is null,parent is end of branch
    for (var i = 0; i < child.length; i++) {
      //generate instances for every children nodes
      //obtain factory class for the node
      var elem: HTMLElement = child[i];
      var tagFactory = this.configurator.getGomlTagFactory(elem.tagName);
      //if factory was not defined, there is nothing to do.
      if (tagFactory) {
        var newNode = tagFactory.CreateNodeForThis(elem, this, parent);
        if (newNode == null) {
          //the factory was obtained, but newNnode is null.
          //It is seem to have something wrong to create instance.
          //It can be occured, the node is written as the form being not desired for the factory.
          console.warn(`${elem.tagName} tag was parsed,but failed to create instance. Skipped.`);
          continue;
        }
        //in first call, it is use for adding into the array for containing root nodes.
        //after first call, it is no used, so this code have no effect after first call.
        actionForChildren(newNode);
        //call this function recursive
        if (!tagFactory.NoNeedParseChildren) this.parseChildren(newNode, $(elem).children(), (e) => { });
      } else {
        //when specified node could not be found
        console.warn(`${elem.tagName} was not parsed.'`);
      }
    }
  }

  public instanciateTemplate(template: string, parentNode: GomlTreeNodeBase) {
    var templateInElems = $(template);
    this.append(templateInElems, parentNode.Element, false);
  }

  public append(source: JQuery, parent: HTMLElement, needLoad?: boolean) {
    if (typeof needLoad === "undefined") needLoad = true;
    var id = parent.getAttribute("x-j3-id");
    var parentOfGoml = this.NodesById.get(id);
    var loadedGomls = [];
    for (var i = 0; i < source.length; i++) {
      var s = source[i];
      this.parseChildren(parentOfGoml, $(s), (v) => { loadedGomls.push(v) });
    }
    if (!needLoad) return;
    this.eachNode(v=> v.beforeLoad(), loadedGomls);
    this.eachNode(v=> v.Load(), loadedGomls);
    this.eachNode(v=> v.afterLoad(), loadedGomls);
    this.eachNode(v=> v.attributes.applyDefaultValue(), loadedGomls);
  }

  public getNode(id: string): GomlTreeNodeBase {
    return this.NodesById.get(id);
  }

  public getNodeByQuery(query: string): GomlTreeNodeBase[] {
    var result = [];
    var found = this.rootObj.find(query);
    for (var index = 0; index < found.length; index++) {
      var id = found[index].getAttribute("x-j3-id");
      result.push(this.getNode(id));
    }
    return result;
  }
}
export = GomlLoader;
