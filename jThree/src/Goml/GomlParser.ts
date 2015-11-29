import JThreeObject = require('../Base/JThreeObject');
import Delegates = require('../Base/Delegates');
import GomlTreeNodeBase = require('./GomlTreeNodeBase');
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import GomlConfigurator = require('./GomlConfigurator');

class GomlParser {

  /**
   * Parser of Goml to Node utilities.
   * This class do not store any nodes and goml properties.
   */
  constructor() {
  }

  /**
   * Parse Goml to Node
   * @param {HTMLElement} soruce [description]
   */
  public static parse(soruce: HTMLElement, configurator: GomlConfigurator) {
    return GomlParser.parseChild(null, soruce, configurator);
  }

  public static parseChild(parent: GomlTreeNodeBase, child: HTMLElement, configurator: GomlConfigurator): GomlTreeNodeBase {
    //obtain factory class for the node
    var elem: HTMLElement = <HTMLElement>child;
    var tagFactory = configurator.getGomlTagFactory(elem.tagName.toUpperCase());
    //if factory was not defined, there is nothing to do.
    if (tagFactory) {
      var newNode = tagFactory.CreateNodeForThis(parent);
      if (newNode == null) {
        //the factory was obtained, but newNnode is null.
        //It is seem to have something wrong to create instance.
        //It can be occured, the node is written as the form being not desired for the factory.
        console.warn(`${elem.tagName} tag was parsed,but failed to create instance. Skipped.`);
        return;
      }
      //call this function recursive
      if (!tagFactory.NoNeedParseChildren) {
        let children = elem.childNodes;
        if (!children) return; //if there children is null, parent is end of branch
        if (children.length == 0) return; //if there children is empty, parent is end of branch
        for (let i = 0; i < children.length; i++) {
          if (!(< HTMLElement>children[i]).tagName) continue;
          // generate instances for every children nodes
          let e = <HTMLElement>children[i];
          GomlParser.parseChild(newNode, e, configurator);
        }
      }
      return newNode;
    } else {
      //when specified node could not be found
      console.warn(`${elem.tagName} was not parsed.'`);
    }
  }
}

export = GomlParser;
