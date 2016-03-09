import JThreeObject from "../Base/JThreeObject";
import EasingFunctionList from "./EasingFunctionList";
import GomlConverterList from "./GomlConverterList";
import GomlNodeList from "./GomlNodeList";
/**
 * Provides configurations that will be used when parse GOML.
 * These properties is intended to be used for extending by plugin feature.
 */
class GomlConfigurator extends JThreeObject {
    /**
     * `TagFactory`, `Converter`の定義を行っています
     *
     * `TagFactory`はNodeを生成するために必要です。ここではタグ名とTagFactoryの関連付けを行っております。
     */
    constructor() {
        super();
        /**
         * List of easing function to indicate how animation will be.
         */
        this._easingFunctions = {};
        /**
         * List of converter function classes.
         */
        this._converters = {};
        /**
         * All list of goml tags that will be parsed and instanciated when parse GOML.
         *
         * Keyはタグ名の文字列(大文字)、ValueはGomlNodeのコンストラクタ
         */
        this._gomlNodes = {};
        this._initializeEasingFunctions();
        this._initializeConverters();
        this._initializeGomlNodes();
    }
    getConverter(name) {
        return this._converters[name];
    }
    getEasingFunction(name) {
        return this._easingFunctions[name];
    }
    /**
     * タグ名からGomlNodeを取得します
     *
     * @param  {string} tagName タグ名
     * @return {GomlTreeNodeBase}
     */
    getGomlNode(tagName) {
        return this._gomlNodes[tagName.toUpperCase()];
    }
    /*
    * Initialize associative array for easing functions that will be used for animation in goml.
    */
    _initializeEasingFunctions() {
        const list = EasingFunctionList;
        for (let key in list) {
            const type = list[key];
            this._easingFunctions[key] = new type();
        }
    }
    /**
     * Initialize converters from list.
     */
    _initializeConverters() {
        const list = GomlConverterList;
        for (let key in list) {
            const type = list[key];
            this._converters[key] = new type();
        }
    }
    /**
     * タグ名とNodeの関連付けを行っています。
     */
    _initializeGomlNodes() {
        const newList = GomlNodeList;
        newList.forEach((v) => {
            for (let key in v.NodeTypes) {
                let keyInString = key;
                keyInString = keyInString.toUpperCase(); // transform into upper case
                const nodeType = v.NodeTypes[keyInString]; // nodeTypeはGomlNodeのコンストラクタ
                this._gomlNodes[keyInString] = nodeType;
            }
        });
    }
}
export default GomlConfigurator;
