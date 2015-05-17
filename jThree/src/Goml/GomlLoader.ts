import GomlTagBase = require("./GomlTagBase");
import GomlTreeNodeBase = require("./GomlTreeNodeBase");
import jThreeObject = require("../Base/JThreeObject");
import GomlRootTag = require("./Tags/GomlRootTag");
import GomlHeadTag = require("./Tags/GomlHeadTag");
import GomlBodyTag = require("./Tags/GomlBodyTag");
import GomlVpTag = require("./Tags/GomlVpTag");
import GomlRdrTag = require("./Tags/GomlRdrTag");
import GomlTriTag = require("./Tags/GomlTriTag");
import GomlMeshTag = require("./Tags/GomlMeshTag");
import Exceptions = require("../Exceptions");
import Delegates = require("../Delegates");
import JQuery = require("jquery");
import GomlSceneTag = require("./Tags/GomlSceneTag");
import GomlCameraTag = require("./Tags/GomlCameraTag");
import GomlTreeCameraNode = require("./Nodes/GomlTreeCameraNode");
import GomlNodeDictionary = require("./GomlNodeDictionary");
import JThreeContext = require("../Core/JThreeContext");
import GomlNodeListElement = require("./GomlNodeListElement");

declare function require(string):any;

class GomlLoader extends jThreeObject {
  test:GomlNodeListElement[]=require('./GomlNodeList');
  constructor()
  {
    super();
    var scriptTags=document.getElementsByTagName('script');
    this.selfTag=scriptTags[scriptTags.length-1];
  }

    private selfTag:HTMLScriptElement;

    private onloadHandler:Delegates.Action1<string>[]=[];
    /*
    * Call passed function if loaded GOML Document.
    */

    public onload(act:Delegates.Action1<string>):void
    {
      this.onloadHandler.push(act);
    }

    private notifyOnLoad(source:string):void
    {
      this.onloadHandler.forEach((v)=>{v(source)});
    }

    gomlTags: Map<string, GomlTagBase> = new Map<string, GomlTagBase>();

    headTagsById: Map<string, GomlTreeNodeBase> = new Map<string, GomlTreeNodeBase>();

    bodyTagsById: Map<string, GomlTreeNodeBase> = new Map<string, GomlTreeNodeBase>();

    nodeDictionary:GomlNodeDictionary=new GomlNodeDictionary();

    rootObj: JQuery;

    headRootNodes: GomlTreeNodeBase[] = [];

    bodyRootNodes: GomlTreeNodeBase[] = [];

    initForPage(): void {
        this.constructTagDictionary();
        this.attemptToLoadGomlInScriptAttr();
        this.rootObj = $("<iframe style='display:none;'/>").appendTo("body").contents();
        var gomls: JQuery = $("script[type='text/goml']");
        gomls.each((index: number, elem: Element) => {
            this.loadScriptTag($(elem));
        });
        console.log(this.rootObj);
    }

    private attemptToLoadGomlInScriptAttr():void
    {
      var url=this.selfTag.getAttribute('x-goml');
      $.get(url, [], (d) => {
          this.scriptLoaded(d);
      });
    }

/**
* Generate Tag dictionary here.
*/
    private constructTagDictionary(): void
     {
       var newList:GomlNodeListElement[]=require('./GomlNodeList');
       newList.forEach((v)=>{
         for(var key in v.NodeTypes)
         {
           var nodeType=v.NodeTypes[key];
           this.addGomlTag(new v.Factory(key,nodeType));
         }
       });
    }

    private addGomlTag(tag: GomlTagBase): void {
        this.gomlTags.set(tag.TagName, tag);
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
            this.scriptLoaded( scriptTag.text());
        }
    }

    private scriptLoaded(source: string): void {
        source = source.replace(/(head|body)>/g, "j$1>");//TODO Can be bug
        console.log("Script Recieved:\n" + source);
        var catched = $(source);
        console.log(catched);
        if (catched[0].tagName !== "GOML") throw new Exceptions.InvalidArgumentException("Root should be goml");
        var headChild = catched.find("jhead").children();
        var bodyChild = catched.find("jbody").children();
        this.parseHead(null,headChild, (e) => {
            this.headRootNodes.push(e);
        });
        this.parseBody(null,bodyChild, (e) => {
            this.bodyRootNodes.push(e);
        });
        this.eachNode(v=>v.beforeLoad());
        this.eachNode(v=>v.Load());
        this.eachNode(v=>v.afterLoad());
        this.notifyOnLoad(source);
    }

    private eachNode(act:Delegates.Action1<GomlTreeNodeBase>)
    {
      this.headTagsById.forEach((v)=>act(v));
      this.bodyTagsById.forEach((v)=>act(v));
    }

    private parseHead(parent:GomlTreeNodeBase,child: JQuery, act: Delegates.Action1<GomlTreeNodeBase>): void {
        if (!child) return;
        console.log(child);
        for (var i = 0; i < child.length; i++) {
            var elem: HTMLElement = child[i];
            if (this.gomlTags.has(elem.tagName)) {
                var newNode = this.gomlTags.get(elem.tagName).CreateNodeForThis(elem,this,parent);
                if(newNode==null)
                {
                  console.warn("{0} tag was parsed,but failed to create instance. Skipped.".format(elem.tagName));
                  continue;
                }
                elem.classList.add("x-j3-" + newNode.ID);
                this.headTagsById.set(newNode.ID, newNode);
                if(parent!=null)
                {
                  parent.addChild(newNode);
                }
                act(newNode);
                this.parseHead(newNode,$(elem).children(), (e) => {  });
            }else{
              console.warn("{0} was not parsed.".format(elem.tagName));
            }
        }
    }

    private parseBody(parent:GomlTreeNodeBase,child: JQuery, act: Delegates.Action1<GomlTreeNodeBase>): void {
        if (!child) return;
        for (var i = 0; i < child.length; i++) {
            var elem: HTMLElement = child[i];
            if (this.gomlTags.has(elem.tagName)) {
                var newNode = this.gomlTags.get(elem.tagName).CreateNodeForThis(elem,this,parent);
                if(newNode==null)
                {
                  console.warn("{0} tag was parsed,but failed to create instance. Skipped.".format(elem.tagName));
                  continue;
                }
                this.bodyTagsById.set(newNode.ID, newNode);
                elem.classList.add("x-j3-" + newNode.ID);
                act(newNode);
                if(parent!=null)
                {
                  parent.addChild(newNode);
                }
                this.parseBody(newNode,$(elem).children(), (e) => {  });

            }else
            {
              console.warn("{0} was not parsed.".format(elem.tagName));
            }
        }
      }
}
export = GomlLoader;
