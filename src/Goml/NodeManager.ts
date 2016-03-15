import JThreeObject from "../Base/JThreeObject";
import GomlNodeDictionary from "../Goml/GomlNodeDictionary";
import GomlTreeNodeBase from "../Goml/GomlTreeNodeBase";
import IContextComponent from "../IContextComponent";
import ContextComponents from "../ContextComponents";
import BehaviorRegistry from "./Behaviors/BehaviorRegistry";
import GomlConfigurator from "./GomlConfigurator";
import BehaviorRunner from "./Behaviors/BehaviorRunner";
import JThreeContext from "../JThreeContext";
import LoopManager from "../Core/LoopManager";
import AttributePromiseRegistry from "./AttributePromiseRegistry";
import GomlParser from "./GomlParser";

class NodeManager extends JThreeObject implements IContextComponent {
  public nodeRegister: GomlNodeDictionary = new GomlNodeDictionary();
  public attributePromiseRegistry: AttributePromiseRegistry = new AttributePromiseRegistry();
  public gomlRoot: GomlTreeNodeBase;
  public htmlRoot: HTMLElement;
  public nodesById: {[nodeId: string]: GomlTreeNodeBase} =  {};
  public behaviorRegistry: BehaviorRegistry = new BehaviorRegistry();
  public behaviorRunner: BehaviorRunner = new BehaviorRunner();
  public ready: boolean = false;

  /**
   * this configurator will load any tag information by require.
   */
  public configurator: GomlConfigurator = new GomlConfigurator();

  constructor() {
    super();
    const loopManager = JThreeContext.getContextComponent<LoopManager>(ContextComponents.LoopManager);
    loopManager.addAction(3000, () => this.update());
  }

  public getContextComponentIndex(): number {
    return ContextComponents.NodeManager;
  }

  public update(): void {
    if (!this.ready) {
      return;
    }
    this.gomlRoot.callRecursive((v: GomlTreeNodeBase) => v.update());
    this.behaviorRunner.executeForAllBehaviors("updateBehavior");
  }

  /**
   * get Node by unique id.
   * @param  {string}           id Unique id string.
   * @return {GomlTreeNodeBase}    Related goml Node.
   */
  public getNode(id: string): GomlTreeNodeBase {
    return this.nodesById[id];
  }

  /**
   * get goml Node by HTMLElement object.
   * @param  {HTMLElement}      elem HTMLElement object.
   * @return {GomlTreeNodeBase}      Related goml Node object.
   */
  public getNodeByElement(elem: HTMLElement): GomlTreeNodeBase {
    const id = elem.getAttribute("x-j3-id");
    return this.getNode(id);
  }

  /**
   * get HTMLElement by goml Node object.
   * @param  {GomlTreeNodeBase} node Goml Node object.
   * @return {HTMLElement}           Related HTMLElement object.
   */
  public getElementByNode(node: GomlTreeNodeBase): HTMLElement {
    return node.props.getProp<HTMLElement>("elem");
  }

  /**
   * get Node by query inside context
   * @param  {string}             query   query string.
   * @param  {GomlTreeNodeBase}   context target Node that search for by query.
   * @return {GomlTreeNodeBase[]}         result Node
   */
  public getNodeByQuery(query: string, context?: GomlTreeNodeBase): GomlTreeNodeBase[] {
    const result = [];
    const target = context ? context.props.getProp<HTMLElement>("elem") : this.htmlRoot;
    const found = target.querySelectorAll(query);
    for (let index = 0; index < found.length; index++) {
      const id = (<HTMLElement>found[index]).getAttribute("x-j3-id");
      result.push(this.getNode(id));
    }
    return result;
  }

  /**
   * Insert goml Node by string.
   * @param {string}           goml       Source string.
   * @param {GomlTreeNodeBase} parentNode The parent Node of inserted children.
   * @param {number}           index      Index of children which will be inserted.
   */
  public insertNodeByString(goml: string, parentNode: GomlTreeNodeBase, index?: number): void {
    const source = (new DOMParser()).parseFromString(goml, "text/xml").documentElement;
    this.insertNodeByElement(source, parentNode, index);
  }

  /**
   * Insert goml Node by HTMLElement object.
   * @param {HTMLElement}      source     Source HTMLElement object.
   * @param {GomlTreeNodeBase} parentNode The parent Node of inserted children.
   * @param {number}           index      Index of children which will be inserted. If you ommision this, insert to end.
   */
  public insertNodeByElement(source: HTMLElement, parentNode: GomlTreeNodeBase, index?: number): void {
    const newNode = GomlParser.parse(source, this.configurator);
    parentNode.addChild(newNode, index);
    this.insertNode(newNode, parentNode, index);
  }

  /**
   * Move node
   * @param {GomlTreeNodeBase} targetNode target node to move
   * @param {GomlTreeNodeBase} parentNode parent node insert in
   */
  public moveNode(targetNode: GomlTreeNodeBase, parentNode: GomlTreeNodeBase, index?: number): void {
    if (targetNode.isRoot) {
      if (targetNode.Mounted) {
        throw new Error("Mounted root node cannot be moved.");
      }
    } else {
      this.removeNode(targetNode);
    }
    this.insertNode(targetNode, parentNode, index);
  }

  /**
   * Insert Node
   * @param {GomlTreeNodeBase} targetNode insert target Node
   * @param {GomlTreeNodeBase} parentNode parent node which is inserted.
   * @param {number}           index      index of node which target will be inserted.
   */
  public insertNode(targetNode: GomlTreeNodeBase, parentNode:GomlTreeNodeBase, index?: number): void {
    parentNode.addChild(targetNode, index);
    const parentElement = parentNode.props.getProp<HTMLElement>("elem");
    const targetElement = targetNode.props.getProp<HTMLElement>("elem");
    const nodeIndex = this._getNodeListIndexByElementIndex(parentElement, index);
    parentElement.insertBefore(targetElement, parentElement[nodeIndex]);
  }

  /**
   * Remove Node. Root of Node cannot be removed.
   * @param {GomlTreeNodeBase} targetNode remove target Node.
   */
  public removeNode(targetNode: GomlTreeNodeBase): void {
    targetNode.remove();
    const targetElement = targetNode.props.getProp<HTMLElement>("elem");
    targetElement.remove();
  }

  /**
   * set goml Node by string.
   * @param {string}     goml       Source string.
   * @param {() => void} callbackfn callback function which will be called when all attributes are initialized.
   */
  public setNodeToRootByString(goml: string, callbackfn: () => void): void {
    const source = (new DOMParser()).parseFromString(goml, "text/xml").documentElement;
    this.setNodeToRootByElement(source, callbackfn);
  }

  /**
   * set goml Node by HTMLElement object.
   * @param {HTMLElement} source     Source HTMLElement object.
   * @param {() => void}  callbackfn callback function which will be called when all attributes are initialized.
   */
  public setNodeToRootByElement(source: HTMLElement, callbackfn: (err: Error) => void): void {
    this.htmlRoot = source;
    if (source === undefined || source.tagName.toUpperCase() !== "GOML") {
      callbackfn(new Error("Root node must be \"goml\""));
      return;
    }
    const parsedNode = GomlParser.parse(source, this.configurator);
    parsedNode.Mounted = true;
    this.gomlRoot = parsedNode;
    console.log("Goml loading was completed");
    this.ready = true;
    this.attributePromiseRegistry.async(() => {
      callbackfn(null);
    });
  }

  private _getNodeListIndexByElementIndex(targetElement, elementIndex): number {
    let _elementIndex = 0;
    let nodeIndex = 0;
    for (let j = 0; j <= targetElement.childNodes.length - 1; j++) {
      if (targetElement.childNodes[j].nodeType === 1) {
        _elementIndex += 1;
        if (_elementIndex === elementIndex) {
          nodeIndex = j;
          break;
        }
      }
    }
    return nodeIndex;
  }
}

export default NodeManager;
