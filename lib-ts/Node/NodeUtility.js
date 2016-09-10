var NodeUtility = (function () {
    function NodeUtility() {
    }
    /**
     * Get index of NodeList converted from index in Element
     * @param  {HTMLElement} targetElement Parent element of search target elements
     * @param  {number}      elementIndex  Index in element
     * @return {number}                    Index in NodeList
     */
    NodeUtility.getNodeListIndexByElementIndex = function (targetElement, elementIndex) {
        var nodeArray = Array.prototype.slice.call(targetElement.childNodes);
        var elementArray = nodeArray.filter(function (v) {
            return v.nodeType === 1;
        });
        elementIndex = elementIndex < 0 ? elementArray.length + elementIndex : elementIndex;
        var index = nodeArray.indexOf(elementArray[elementIndex]);
        return index === -1 ? null : index;
    };
    return NodeUtility;
})();
exports["default"] = NodeUtility;
