class NodeUtility {
  /**
   * Get index of NodeList converted from index in Element
   * @param  {HTMLElement} targetElement Parent element of search target elements
   * @param  {number}      elementIndex  Index in element
   * @return {number}                    Index in NodeList
   */
  public static getNodeListIndexByElementIndex(targetElement: HTMLElement, elementIndex: number): number {
    const nodeArray: Node[] = Array.prototype.slice.call(targetElement.childNodes);
    const elementArray = nodeArray.filter((v) => {
      return v.nodeType === 1;
    });
    elementIndex = elementIndex < 0 ? elementArray.length + elementIndex : elementIndex;
    const index = nodeArray.indexOf(elementArray[elementIndex]);
    return index === -1 ? null : index;
  }
}

export default NodeUtility;
