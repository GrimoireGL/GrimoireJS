import JThreeObject = require('../Base/JThreeObject');
import Delegates = require('../Base/Delegates');
import GomlTreeNodeBase = require('./GomlTreeNodeBase');
import GomlLoaderConfigurator = require('./GomlLoaderConfigurator');
import AssociativeArray = require('../Base/Collections/AssociativeArray');

class GomlParser {

  /**
   * Parser of Goml to Node utilities.
   * This class do not store any nodes and goml properties.
   */
  constructor() {
  }

  private static configurator: GomlLoaderConfigurator = new GomlLoaderConfigurator();

  /**
   * Parse Goml to Node
   * @param {HTMLElement} soruce [description]
   */
  public static parse(soruce: HTMLElement) {
    let nodes: AssociativeArray<GomlTreeNodeBase[]> = new AssociativeArray<GomlTreeNodeBase[]>();
    if (soruce === undefined || soruce.tagName.toUpperCase() !== 'GOML') {
      // source has goml root
      this.configurator.GomlRootNodes.forEach((v) => {
        nodes.set(v, []);
        // find root nodes directly under goml
        let found_items: NodeList = soruce.querySelectorAll(`goml > ${v}`);
        for (let i = 0; i < found_items.length; i++) {
          this.parseChildren(null, found_items[i].childNodes, (e) => {
            nodes.get(v).push(e);
          });
        }
      });
      let targets = this.configurator.GomlRootNodes.map((v) => nodes.get(v));
      targets.forEach((t) => this.eachNode((v) => v.beforeLoad(), t));
      targets.forEach((t) => this.eachNode((v) => v.Load(), t));
      targets.forEach((t) => this.eachNode((v) => v.afterLoad(), t));
      targets.forEach((t) => this.eachNode((v) => v.attributes.applyDefaultValue(), t));
    } else {
      // srouce has fragment of goml
      let target = soruce.childNodes
      this.parseChildren(null, target, (e) => {
        nodes.get(v).push(e);
      });
    }
  }

  private static eachNode(act: Delegates.Action1<GomlTreeNodeBase>, targets: GomlTreeNodeBase[]) {
    targets.forEach((v) => {
      v.callRecursive(act);
    });
    return;
  }

  private static parseChild(parent: GomlTreeNodeBase, child: HTMLElement, actionForChildren: Delegates.Action1<GomlTreeNodeBase>): void {
    //obtain factory class for the node
    var elem: HTMLElement = <HTMLElement>child;
    var tagFactory = this.configurator.getGomlTagFactory(elem.tagName.toUpperCase());
    //if factory was not defined, there is nothing to do.
    if (tagFactory) {
      var newNode = tagFactory.CreateNodeForThis(elem, this, parent);
      if (newNode == null) {
        //the factory was obtained, but newNnode is null.
        //It is seem to have something wrong to create instance.
        //It can be occured, the node is written as the form being not desired for the factory.
        console.warn(`${elem.tagName} tag was parsed,but failed to create instance. Skipped.`);
        return;
      }
      //in first call, it is use for adding into the array for containing root nodes.
      //after first call, it is no used, so this code have no effect after first call.
      actionForChildren(newNode);
      //call this function recursive
      if (!tagFactory.NoNeedParseChildren) this.parseChildren(newNode, elem.childNodes, (e) => { });
    } else {
      //when specified node could not be found
      console.warn(`${elem.tagName} was not parsed.'`);
    }
  }

  private static parseChildren(parent: GomlTreeNodeBase, children: NodeList, actionForChildren: Delegates.Action1<GomlTreeNodeBase>): void {
    if (!children) return; //if there children is null, parent is end of branch
    if (children.length == 0) return; //if there children is empty, parent is end of branch
    for (var i = 0; i < children.length; i++) {
      if (!(< HTMLElement>children[i]).tagName) continue;
      // generate instances for every children nodes
      var e = <HTMLElement>children[i];
      this.parseChild(parent, e, actionForChildren);
    }
  }
}

export = GomlParser;
