import IDObject from "../Base/IDObject";
import GomlNodeDictionary from "../Goml/GomlNodeDictionary";
import GomlTreeNodeBase from "../Goml/GomlTreeNodeBase";
import GomlConfigurator from "./GomlConfigurator";
import LoopManager from "../Core/LoopManager";
import AttributePromiseRegistry from "./AttributePromiseRegistry";
import GomlParser from "./GomlParser";
import ModuleManager from "../Module/ModuleManager";
import EventOrgnizer from "../Interface/Events/EventOrgnizer";

class NodeManager extends IDObject {
    public static instance: NodeManager;
    public nodeRegister: GomlNodeDictionary = new GomlNodeDictionary();
    public attributePromiseRegistry: AttributePromiseRegistry = new AttributePromiseRegistry();
    public gomlRoot: GomlTreeNodeBase;
    public htmlRoot: HTMLElement;
    public nodesById: { [nodeId: string]: GomlTreeNodeBase } = {};
    public ready: boolean = false;

    /**
     * this configurator will load any tag information by require.
     */
    public configurator: GomlConfigurator = new GomlConfigurator();

    constructor() {
        super();
        LoopManager.addAction(3000, () => this.update());
    }


    public update(): void {
        if (!this.ready) {
            return;
        }
        this.gomlRoot.callRecursive((v: GomlTreeNodeBase) => v.update());
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
     * Insert Node
     * @param {GomlTreeNodeBase} contentNode insert target Node
     * @param {GomlTreeNodeBase} parentNode parent node which is inserted.
     * @param {number}           index      index of node which target will be inserted. If index is not given, node will be inserted to the end of children.
     */
    public insertNode(contentNode: GomlTreeNodeBase, parentNode: GomlTreeNodeBase, index?: number): void {
        parentNode.addChild(contentNode, index);
        const parentElement = parentNode.props.getProp<HTMLElement>("elem");
        const targetElement = contentNode.props.getProp<HTMLElement>("elem");
        let referenceElement: Node = null;
        if (index != null) {
            const nodeIndex = this._getNodeListIndexByElementIndex(parentElement, index);
            referenceElement = parentElement.childNodes[nodeIndex];
        }
        parentElement.insertBefore(targetElement, referenceElement);
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
     * Move node
     * @param {GomlTreeNodeBase} contentNode target node to move
     * @param {GomlTreeNodeBase} parentNode parent node insert in
     */
    public moveNode(contentNode: GomlTreeNodeBase, parentNode: GomlTreeNodeBase, index?: number): void {
        if (contentNode.isRoot) {
            if (contentNode.Mounted) {
                throw new Error("Mounted root node cannot be moved.");
            }
        } else {
            this.removeNode(contentNode);
        }
        this.insertNode(contentNode, parentNode, index);
    }

    public cloneNode(targetNode: GomlTreeNodeBase, withEvent: boolean, deepWithEvent: boolean): GomlTreeNodeBase {
        const elem = <HTMLElement>targetNode.props.getProp<HTMLElement>("elem").cloneNode(true);
        const cloned = GomlParser.parse(elem, this.configurator);
        if (deepWithEvent) {
            const dugEvents = targetNode.callRecursiveWithReturn((node) => {
                let event: EventOrgnizer;
                const eo = (<GomlTreeNodeBase>node).props.getProp<EventOrgnizer>("event");
                if (eo) {
                    event = eo.clone(<GomlTreeNodeBase>node);
                }
                return event;
            });
            let cnt = 0;
            cloned.callRecursive((node: GomlTreeNodeBase) => {
                node.props.setProp("event", dugEvents[cnt]);
                cnt += 1;
            });
        } else if (withEvent) {
            cloned.props.setProp("event", targetNode.props.getProp<EventOrgnizer>("event"));
        }
        return cloned;
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
        this.attributePromiseRegistry.enabled = true;
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
        ModuleManager.ready = true;
        this.attributePromiseRegistry.async(() => {
            this.attributePromiseRegistry.enabled = false;
            callbackfn(null);
        });
    }

    /**
     * Get index in NodeList object by index in Element array.
     * @param  {HTMLElement} targetElement parent element for searching index of children. If this argument is negative number, index will be searched from last.
     * @param  {number}      elementIndex  index in Element array
     * @return {number}                    index in NodeList
     */
    private _getNodeListIndexByElementIndex(targetElement: HTMLElement, elementIndex: number): number {
        const nodeListArray: Node[] = Array.prototype.slice.call(targetElement.childNodes);
        elementIndex = elementIndex < 0 ? nodeListArray.length + elementIndex : elementIndex;
        return nodeListArray.indexOf(nodeListArray.filter((v) => {
            return v.nodeType === 1;
        })[elementIndex]);
    }
}
NodeManager.instance = new NodeManager();
export default NodeManager.instance;
