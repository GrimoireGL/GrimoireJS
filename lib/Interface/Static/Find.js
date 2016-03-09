import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
class Find {
    /**
     * Search Node from selector query.
     * @param  {string}             selector selector query string.
     * @param  {GomlTreeNodeBase}   context  target for searching.
     * @return {GomlTreeNodeBase[]}          found Nodes.
     */
    static find(selector, context) {
        return JThreeContext.getContextComponent(ContextComponents.NodeManager).getNodeByQuery(selector, context);
    }
}
export default Find;
