class NodeUtility { // TODO merge with Base/XMLReader
  /**
   * Get index of NodeList converted from index in Element
   * @param  {HTMLElement} targetElement Parent element of search target elements
   * @param  {number}      elementIndex  Index in element
   * @return {number}                    Index in NodeList
   */
  public static getNodeListIndexByElementIndex(targetElement: Element, elementIndex: number): number {
    const nodeArray: Node[] = Array.prototype.slice.call(targetElement.childNodes);
    const elementArray = nodeArray.filter((v) => {
      return v.nodeType === 1;
    });
    elementIndex = elementIndex < 0 ? elementArray.length + elementIndex : elementIndex;
    return nodeArray.indexOf(elementArray[elementIndex]);
  }

  public static getAttributes(element: Element): { [key: string]: string } {
    const attributes: { [key: string]: string } = {};
    const domAttr = element.attributes;
    for (let i = 0; i < domAttr.length; i++) {
      const attrNode = domAttr.item(i);
      if (attrNode.name.startsWith("xmlns")) {
        continue;
      }
      const name = attrNode.namespaceURI ? attrNode.namespaceURI + "." + attrNode.localName! : attrNode.localName!;
      attributes[name] = attrNode.value;
    }
    return attributes;
  }
}

export default NodeUtility;
