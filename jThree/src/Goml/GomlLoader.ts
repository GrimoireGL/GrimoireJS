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
  update()
  {
    // this.eachNode(e=>{
    //   e.update.bind(this);
    // });
  }
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

  /**
  * this configurator will load any tag information by require
  */
  private configurator:GomlLoaderConfigurator=new GomlLoaderConfigurator();

  /**
  * The configurator for new tag,converter,easingfunctions
  */
  public get Configurator():GomlLoaderConfigurator
  {
    return this.configurator;
  }

  nodeRegister: GomlNodeDictionary = new GomlNodeDictionary();

  moduleRegistry: ModuleRegistry = new ModuleRegistry();

  rootObj: JQuery;

  rootNodes:AssociativeArray<GomlTreeNodeBase[]>=new AssociativeArray<GomlTreeNodeBase[]>();

  NodesById:AssociativeArray<GomlTreeNodeBase>=new AssociativeArray<GomlTreeNodeBase>();


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
    var catched = this.rootObj = $(source);
    if (catched[0].tagName !== "GOML") throw new Exceptions.InvalidArgumentException("Root should be goml");
    //generate node tree
    this.configurator.GomlRootNodes.forEach(v=>{
      var children = catched.find(v).children();
      this.rootNodes.set(v,[]);
      this.parseChildren(null,children,(e)=>{
        this.rootNodes.get(v).push(e);
      })
    });
    this.eachNode(v=> v.beforeLoad());
    this.eachNode(v=> v.Load());
    this.eachNode(v=> v.afterLoad());
    this.onLoadEvent.fire(this, source);
  }

  private eachNode(act: Delegates.Action1<GomlTreeNodeBase>) {
    this.configurator.GomlRootNodes.forEach(v=>{
      this.rootNodes.get(v).forEach(e=>e.callRecursive(act));
    });
  }

  private parseChildren(parent: GomlTreeNodeBase, child: JQuery, actionForChildren: Delegates.Action1<GomlTreeNodeBase>): void {
    if (!child) return;//if there child is null,parent is end of branch
    for (var i = 0; i < child.length; i++) {
      //generate instances for every children nodes
      //obtain factory class for the node
      var elem: HTMLElement = child[i];
      var tagFactory=this.configurator.getGomlTagFactory(elem.tagName);
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
        //configure class name and attribute to HTMLElement to make it easy to find this node in next time.
        elem.classList.add("x-j3-" + newNode.ID);
        elem.setAttribute('x-j3-id', newNode.ID);
        //after configuration, this node is going to add to NodesById
        this.NodesById.set(newNode.ID, newNode);
        //in first call, it is use for adding into the array for containing root nodes.
        //after first call, it is no used, so this code have no effect after first call.
        actionForChildren(newNode);
        //call this function recursive
        this.parseChildren(newNode, $(elem).children(), (e) => { });
      } else {
        //when specified node could not be found
        console.warn(`${elem.tagName} was not parsed.'`);
      }
    }
  }

  public appendChildren(jq: JQuery, parent: HTMLElement, parentInGoml?: GomlTreeNodeBase, loadedGoml?: GomlTreeNodeBase[]): void {
    var needLastProcess = false;//TODO refactor this method
    if (!jq) return;
    if (!parentInGoml) {
      var id = parent.getAttribute("x-j3-id");
      parentInGoml = this.NodesById.get(id);
      needLastProcess = true;
      loadedGoml = [];
    }
    for (var i = 0; i < jq.length; i++) {
      var e = jq[i];
      var tagFactory=this.configurator.getGomlTagFactory(e.tagName)
      if (tagFactory) {
        var newNode = tagFactory.CreateNodeForThis(e, this, parentInGoml);
        if (newNode == null) {
          console.warn(`${e.tagName} tag was parsed,but failed to create instance. Skipped.`);
        } else {
          this.NodesById.set(newNode.ID, newNode);
          e.classList.add("x-j3-" + newNode.ID)
          e.setAttribute('x-j3-id', newNode.ID);
          loadedGoml.push((newNode));
          this.appendChildren($(e).children(), null, newNode, loadedGoml);
        }

      } else {
        console.warn(`${e.tagName} was not parsed.`);
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
    return this.NodesById.get(id);
  }
}
export = GomlLoader;
