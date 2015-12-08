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
  public static parse(soruce: HTMLElement, configurator: GomlConfigurator): GomlTreeNodeBase {
    return GomlParser.parseChild(null, soruce, configurator);
  }

  public static parseChild(parent: GomlTreeNodeBase, child: HTMLElement, configurator: GomlConfigurator): GomlTreeNodeBase {
    //obtain factory class for the node
    let elem: HTMLElement = <HTMLElement>child;
    const newNode = GomlParser.createNode(elem, configurator);
    // タグ名が無効、又はattibuteが無効だった場合にはパースはキャンセルされる。HTMLElement側のattrにparseされていないことを記述
    if (newNode) {
      if (newNode == null) {
        //the factory was obtained, but newNnode is null.
        //It is seem to have something wrong to create instance.
        //It can be occured, the node is written as the form being not desired for the factory.
        console.warn(`${elem.tagName} tag was parsed,but failed to create instance. Skipped.`);
        return;
      }
      //call this function recursive
      let children = elem.childNodes;
      if (!children) return; //if there children is null, parent is end of branch
      if (children.length == 0) return; //if there children is empty, parent is end of branch
      for (let i = 0; i < children.length; i++) {
        if (!(<HTMLElement>children[i]).tagName) continue;
        // generate instances for every children nodes
        let e = <HTMLElement>children[i];
        GomlParser.parseChild(newNode, e, configurator);
      }
      return newNode;
    } else {
      //when specified node could not be found
      console.warn(`${elem.tagName} was not parsed.'`);
    }
  }

  /**
   * GomlNodeの生成、初期化を行います。
   *
   * GomlNodeの生成のライフサイクルを定義しています。
   * @param  {HTMLElement}      elem         [description]
   * @param  {GomlConfigurator} configurator [description]
   * @return {GomlTreeNodeBase}              [description]
   */
  private static createNode(elem: HTMLElement, configurator: GomlConfigurator): GomlTreeNodeBase {
    const tagName = elem.tagName;
    const nodeType = configurator.getGomlNode(tagName);
    /**
     * インスタンス生成
     * それぞれのGomlNodeのattributeの定義、attribute更新時のイベント、child, parent更新時のイベントの定義
     */
    const newNode = <GomlTreeNodeBase>new (<any>nodeType)();
    /**
     * HTMLElementのattributeとのバインディング
     */
    Object.keys(elem.attributes).forEach((attrKey) => {
      const attrValue = elem.attributes[attrKey];
      const gomlAttribute = newNode.attributes.getAttribute(attrKey);
      if (gomlAttribute) {
        gomlAttribute.Value = attrValue;
        gomlAttribute.on('changed', (ga) => {
          elem.setAttribute(attrKey, ga.Value);
        });
      }
    });
    /**
     * attributeの初期化完了の通知
     * attributeのchangedイベントの発火
     * 設定されたattributeを元に処理を行う
     */
    newNode.initialize();
    newNode.attributes.forEachAttr((ga) => {
      ga.initialize();
    });
    return newNode;
  }
}

export = GomlParser;
