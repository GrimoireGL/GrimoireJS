import JThreeObject from "../Base/JThreeObject";
/**
 * GomlNodeをグループとしてまとめて管理します
 */
class GomlNodeListElement extends JThreeObject {
    /**
     * constructor
     *
     * @param {string} group    グループ識別用の文字列。すべて大文字で管理されています。
     * @param {any}}  nodeTypes グループ内のGomlNodeのconstructorをまとめるObject。Tag名がKeyとなっています。
     */
    constructor(group, nodeTypes) {
        super();
        this._group = group;
        this._nodeTypes = nodeTypes;
    }
    get Group() {
        return this._group;
    }
    get NodeTypes() {
        return this._nodeTypes;
    }
}
export default GomlNodeListElement;
