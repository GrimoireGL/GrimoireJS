/**
 * Parser of Goml to Node utilities.
 * This class do not store any nodes and goml properties.
 */
class GomlParser {
    /**
     * Parse Goml to Node
     * @param {HTMLElement} soruce [description]
     */
    static parse(soruce, configurator) {
        return GomlParser.parseChild(soruce, configurator);
    }
    static parseChild(child, configurator) {
        // obtain factory class for the node
        const elem = child;
        const newNode = GomlParser._createNode(elem, configurator);
        // タグ名が無効、又はattibuteが無効だった場合にはパースはキャンセルされる。HTMLElement側のattrにparseされていないことを記述
        if (newNode) {
            // call this function recursive
            const children = elem.childNodes;
            if (children && children.length !== 0) {
                for (let i = 0; i < children.length; i++) {
                    if (children[i].nodeType !== 1) {
                        continue;
                    }
                    // generate instances for every children nodes
                    const e = children[i];
                    const newChildNode = GomlParser.parseChild(e, configurator);
                    if (newChildNode) {
                        newNode.addChild(newChildNode);
                    }
                }
            }
            // console.log("parseChild finish:", newNode);
            return newNode;
        }
        else {
            // when specified node could not be found
            console.warn(`"${elem.tagName}" was not parsed.`);
            return null;
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
    static _createNode(elem, configurator) {
        // console.log("START");
        const tagName = elem.tagName;
        // console.log(`createNode: ${tagName}`);
        const nodeType = configurator.getGomlNode(tagName);
        /**
         * インスタンス生成
         * それぞれのGomlNodeのattributeの定義、attribute更新時のイベント、child, parent更新時のイベントの定義
         */
        if (nodeType === undefined) {
            throw new Error(`Tag ${tagName} is not found.`);
        }
        const newNode = new nodeType();
        /**
         * HTMLElementのattributeとのバインディング
         *
         * Nodeの必須Attributes一覧を取得し、HTMLElementに存在しなければ追加。
         * HTMLElementのすべてのattributesを取得し、NodeのAttributesに反映。なかった場合にはreserveする。
         */
        // console.log(elem.outerHTML);
        newNode.attributes.forEachAttr((attr, key) => {
            if (!elem.getAttribute(key)) {
                // console.log("add essential attr:", key, attr.ValueStr, attr.Value);
                elem.setAttribute(key, attr.ValueStr);
            }
        });
        for (let i = 0; i <= elem.attributes.length - 1; i++) {
            let attr = elem.attributes[i];
            ((attr_) => {
                const attrKey = attr_.nodeName;
                const attrValue = attr_.nodeValue;
                let gomlAttribute = newNode.attributes.getAttribute(attrKey);
                // console.log("attribute_binding", attrKey, attrValue, gomlAttribute);
                if (!gomlAttribute) {
                    gomlAttribute = newNode.attributes.reserveAttribute(attrKey, attrValue);
                }
                else {
                    gomlAttribute.Value = attrValue;
                }
                gomlAttribute.on("changed", (ga) => {
                    elem.setAttribute(attrKey, ga.ValueStr);
                });
            })(attr);
        }
        newNode.props.setProp("elem", elem);
        elem.setAttribute("x-j3-id", newNode.ID);
        // console.log("END");
        return newNode;
    }
}
export default GomlParser;

//# sourceMappingURL=data:application/json;base64,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QUFVLENBQUMiLCJmaWxlIjoiR29tbC9Hb21sUGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdvbWxUcmVlTm9kZUJhc2UgZnJvbSBcIi4vR29tbFRyZWVOb2RlQmFzZVwiO1xuaW1wb3J0IEdvbWxDb25maWd1cmF0b3IgZnJvbSBcIi4vR29tbENvbmZpZ3VyYXRvclwiO1xuaW1wb3J0IEdvbWxBdHRyaWJ1dGUgZnJvbSBcIi4vR29tbEF0dHJpYnV0ZVwiO1xuXG4vKipcbiAqIFBhcnNlciBvZiBHb21sIHRvIE5vZGUgdXRpbGl0aWVzLlxuICogVGhpcyBjbGFzcyBkbyBub3Qgc3RvcmUgYW55IG5vZGVzIGFuZCBnb21sIHByb3BlcnRpZXMuXG4gKi9cbmNsYXNzIEdvbWxQYXJzZXIge1xuICAvKipcbiAgICogUGFyc2UgR29tbCB0byBOb2RlXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNvcnVjZSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHBhcnNlKHNvcnVjZTogSFRNTEVsZW1lbnQsIGNvbmZpZ3VyYXRvcjogR29tbENvbmZpZ3VyYXRvcik6IEdvbWxUcmVlTm9kZUJhc2Uge1xuICAgIHJldHVybiBHb21sUGFyc2VyLnBhcnNlQ2hpbGQoc29ydWNlLCBjb25maWd1cmF0b3IpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBwYXJzZUNoaWxkKGNoaWxkOiBIVE1MRWxlbWVudCwgY29uZmlndXJhdG9yOiBHb21sQ29uZmlndXJhdG9yKTogR29tbFRyZWVOb2RlQmFzZSB7XG4gICAgLy8gb2J0YWluIGZhY3RvcnkgY2xhc3MgZm9yIHRoZSBub2RlXG4gICAgY29uc3QgZWxlbTogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+Y2hpbGQ7XG4gICAgY29uc3QgbmV3Tm9kZSA9IEdvbWxQYXJzZXIuX2NyZWF0ZU5vZGUoZWxlbSwgY29uZmlndXJhdG9yKTtcbiAgICAvLyDjgr/jgrDlkI3jgYznhKHlirnjgIHlj4jjga9hdHRpYnV0ZeOBjOeEoeWKueOBoOOBo+OBn+WgtOWQiOOBq+OBr+ODkeODvOOCueOBr+OCreODo+ODs+OCu+ODq+OBleOCjOOCi+OAgkhUTUxFbGVtZW505YG044GuYXR0cuOBq3BhcnNl44GV44KM44Gm44GE44Gq44GE44GT44Go44KS6KiY6L+wXG4gICAgaWYgKG5ld05vZGUpIHtcbiAgICAgIC8vIGNhbGwgdGhpcyBmdW5jdGlvbiByZWN1cnNpdmVcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gZWxlbS5jaGlsZE5vZGVzO1xuICAgICAgaWYgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNoaWxkcmVuW2ldLm5vZGVUeXBlICE9PSAxKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gZ2VuZXJhdGUgaW5zdGFuY2VzIGZvciBldmVyeSBjaGlsZHJlbiBub2Rlc1xuICAgICAgICAgIGNvbnN0IGUgPSA8SFRNTEVsZW1lbnQ+Y2hpbGRyZW5baV07XG4gICAgICAgICAgY29uc3QgbmV3Q2hpbGROb2RlID0gR29tbFBhcnNlci5wYXJzZUNoaWxkKGUsIGNvbmZpZ3VyYXRvcik7XG4gICAgICAgICAgaWYgKG5ld0NoaWxkTm9kZSkge1xuICAgICAgICAgICAgbmV3Tm9kZS5hZGRDaGlsZChuZXdDaGlsZE5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gY29uc29sZS5sb2coXCJwYXJzZUNoaWxkIGZpbmlzaDpcIiwgbmV3Tm9kZSk7XG4gICAgICByZXR1cm4gbmV3Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gd2hlbiBzcGVjaWZpZWQgbm9kZSBjb3VsZCBub3QgYmUgZm91bmRcbiAgICAgIGNvbnNvbGUud2FybihgXCIke2VsZW0udGFnTmFtZX1cIiB3YXMgbm90IHBhcnNlZC5gKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHb21sTm9kZeOBrueUn+aIkOOAgeWIneacn+WMluOCkuihjOOBhOOBvuOBmeOAglxuICAgKlxuICAgKiBHb21sTm9kZeOBrueUn+aIkOOBruODqeOCpOODleOCteOCpOOCr+ODq+OCkuWumue+qeOBl+OBpuOBhOOBvuOBmeOAglxuICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgICBlbGVtICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtHb21sQ29uZmlndXJhdG9yfSBjb25maWd1cmF0b3IgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtHb21sVHJlZU5vZGVCYXNlfSAgICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgX2NyZWF0ZU5vZGUoZWxlbTogSFRNTEVsZW1lbnQsIGNvbmZpZ3VyYXRvcjogR29tbENvbmZpZ3VyYXRvcik6IEdvbWxUcmVlTm9kZUJhc2Uge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiU1RBUlRcIik7XG4gICAgY29uc3QgdGFnTmFtZSA9IGVsZW0udGFnTmFtZTtcbiAgICAvLyBjb25zb2xlLmxvZyhgY3JlYXRlTm9kZTogJHt0YWdOYW1lfWApO1xuICAgIGNvbnN0IG5vZGVUeXBlID0gY29uZmlndXJhdG9yLmdldEdvbWxOb2RlKHRhZ05hbWUpO1xuICAgIC8qKlxuICAgICAqIOOCpOODs+OCueOCv+ODs+OCueeUn+aIkFxuICAgICAqIOOBneOCjOOBnuOCjOOBrkdvbWxOb2Rl44GuYXR0cmlidXRl44Gu5a6a576p44CBYXR0cmlidXRl5pu05paw5pmC44Gu44Kk44OZ44Oz44OI44CBY2hpbGQsIHBhcmVudOabtOaWsOaZguOBruOCpOODmeODs+ODiOOBruWumue+qVxuICAgICAqL1xuICAgIGlmIChub2RlVHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRhZyAke3RhZ05hbWV9IGlzIG5vdCBmb3VuZC5gKTtcbiAgICAgIC8vIFByb2Nlc3MgaXMgY3V0IG9mZiBoZXJlLlxuICAgICAgLy8gVGhpcyB3aWxsIGJlIGRlYWwgYnkgcGFzcyBvciBjcmVhdGUgbW9jayBpbnN0YW5jZS5cbiAgICB9XG4gICAgY29uc3QgbmV3Tm9kZSA9IG5ldyBub2RlVHlwZSgpO1xuICAgIC8qKlxuICAgICAqIEhUTUxFbGVtZW5044GuYXR0cmlidXRl44Go44Gu44OQ44Kk44Oz44OH44Kj44Oz44KwXG4gICAgICpcbiAgICAgKiBOb2Rl44Gu5b+F6aCIQXR0cmlidXRlc+S4gOimp+OCkuWPluW+l+OBl+OAgUhUTUxFbGVtZW5044Gr5a2Y5Zyo44GX44Gq44GR44KM44Gw6L+95Yqg44CCXG4gICAgICogSFRNTEVsZW1lbnTjga7jgZnjgbnjgabjga5hdHRyaWJ1dGVz44KS5Y+W5b6X44GX44CBTm9kZeOBrkF0dHJpYnV0ZXPjgavlj43mmKDjgILjgarjgYvjgaPjgZ/loLTlkIjjgavjga9yZXNlcnZl44GZ44KL44CCXG4gICAgICovXG4gICAgLy8gY29uc29sZS5sb2coZWxlbS5vdXRlckhUTUwpO1xuICAgIG5ld05vZGUuYXR0cmlidXRlcy5mb3JFYWNoQXR0cigoYXR0ciwga2V5KSA9PiB7XG4gICAgICBpZiAoIWVsZW0uZ2V0QXR0cmlidXRlKGtleSkpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJhZGQgZXNzZW50aWFsIGF0dHI6XCIsIGtleSwgYXR0ci5WYWx1ZVN0ciwgYXR0ci5WYWx1ZSk7XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleSwgYXR0ci5WYWx1ZVN0cik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZWxlbS5hdHRyaWJ1dGVzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgbGV0IGF0dHIgPSBlbGVtLmF0dHJpYnV0ZXNbaV07XG4gICAgICAoKGF0dHJfOiBOb2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IGF0dHJLZXkgPSBhdHRyXy5ub2RlTmFtZTtcbiAgICAgICAgY29uc3QgYXR0clZhbHVlID0gYXR0cl8ubm9kZVZhbHVlO1xuICAgICAgICBsZXQgZ29tbEF0dHJpYnV0ZSA9IG5ld05vZGUuYXR0cmlidXRlcy5nZXRBdHRyaWJ1dGUoYXR0cktleSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYXR0cmlidXRlX2JpbmRpbmdcIiwgYXR0cktleSwgYXR0clZhbHVlLCBnb21sQXR0cmlidXRlKTtcbiAgICAgICAgaWYgKCFnb21sQXR0cmlidXRlKSB7XG4gICAgICAgICAgZ29tbEF0dHJpYnV0ZSA9IG5ld05vZGUuYXR0cmlidXRlcy5yZXNlcnZlQXR0cmlidXRlKGF0dHJLZXksIGF0dHJWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ29tbEF0dHJpYnV0ZS5WYWx1ZSA9IGF0dHJWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBnb21sQXR0cmlidXRlLm9uKFwiY2hhbmdlZFwiLCAoZ2E6IEdvbWxBdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShhdHRyS2V5LCBnYS5WYWx1ZVN0cik7XG4gICAgICAgIH0pO1xuICAgICAgfSkoYXR0cik7XG4gICAgfVxuICAgIG5ld05vZGUucHJvcHMuc2V0UHJvcDxIVE1MRWxlbWVudD4oXCJlbGVtXCIsIGVsZW0pO1xuICAgIGVsZW0uc2V0QXR0cmlidXRlKFwieC1qMy1pZFwiLCBuZXdOb2RlLklEKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIkVORFwiKTtcbiAgICByZXR1cm4gbmV3Tm9kZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHb21sUGFyc2VyO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
