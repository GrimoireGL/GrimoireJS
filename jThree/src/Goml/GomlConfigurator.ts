import GomlNodeListElement = require("./GomlNodeListElement");
import JThreeObject = require("../Base/JThreeObject");
import EasingFunction = require("./Easing/EasingFunctionBase");
import AssociativeArray = require("../Base/Collections/AssociativeArray");
import AttributeConvrterBase = require("./Converter/AttributeConverterBase");
import GomlTreeNodeBase = require('./GomlTreeNodeBase');

declare function require(string): any;

/**
 * Provides configurations that will be used when parse GOML.
 * These properties is intended to be used for extending by plugin feature.
 */
class GomlConfigurator extends JThreeObject
{
    /**
     * List of easing function to indicate how animation will be.
     */
    private easingFunctions: AssociativeArray<EasingFunction> = new AssociativeArray<EasingFunction>();
    /**
     * List of converter function classes.
     */
    private converters: AssociativeArray<AttributeConvrterBase> = new AssociativeArray<AttributeConvrterBase>();
    /**
     * All list of goml tags that will be parsed and instanciated when parse GOML.
     */
    private gomlNodes: AssociativeArray<GomlTreeNodeBase> = new AssociativeArray<GomlTreeNodeBase>();

    public getConverter(name: string): AttributeConvrterBase
    {
        return this.converters.get(name);
    }

    public getEasingFunction(name: string): EasingFunction
    {
        return this.easingFunctions.get(name);
    }

    /**
     * タグ名から`TagFactory`を取得します
     *
     * @param  {string} tagName タグ名
     * @return {TagFactory}
     */
    public getGomlTagFactory(tagName: string): TagFactory
    {
        return this.gomlNodes.get(tagName);
    }

    /**
     * `TagFactory`, `Converter`の定義を行っています
     *
     * `TagFactory`はNodeを生成するために必要です。ここではタグ名とTagFactoryの関連付けを行っております。
     */
    constructor()
    {
        super();
        this.initializeEasingFunctions();
        this.initializeConverters();
        this.initializeGomlNodes();
    }

    /*
    * Initialize associative array for easing functions that will be used for animation in goml.
    */
    private initializeEasingFunctions()
    {
        this.loadIntoAssociativeArray(this.easingFunctions, require("./EasingFunctionList"));
    }
    /**
     * Initialize converters from list.
     */
    private initializeConverters()
    {
        this.loadIntoAssociativeArray(this.converters, require("./GomlConverterList"));
    }

    /**
     * タグ名とNodeの関連付けを行っています。
     */
    private initializeGomlNodes()
    {
        var newList: GomlNodeListElement[] = require("./GomlNodeList");
        newList.forEach((v) =>
        {
            for (var key in v.NodeTypes)
            {
                var keyInString: string = key;
                keyInString = keyInString.toUpperCase();//transform into upper case
                var nodeType = v.NodeTypes[keyInString];
                this.gomlNodes.set(keyInString, );
            }
        });
    }

    /**
    * Initialize something associative array from required hash.
    */
    private loadIntoAssociativeArray<T>(targetArray: AssociativeArray<T>, list: { [key: string]: any })
    {
        for (var key in list)
        {
            var type = list[key];
            targetArray.set(key, new type());
        }
    }
}
export = GomlConfigurator;
