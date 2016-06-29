import GomlTreeNodeBase from "../Goml/GomlTreeNodeBase";
import J3ObjectBase from "./J3ObjectBase";
import isArray from "lodash.isarray";
import isString from "lodash.isstring";
import XMLParser from "../Goml/XMLParser";
import GomlParser from "../Goml/GomlParser";
import NodeManager from "../Goml/NodeManager";
// for Implements
import GomlNodeMethods from "./Miscellaneous/GomlNodeMethods";
import TreeTraversal from "./Traversing/TreeTraversal";
import Filtering from "./Traversing/Filtering";
import GeneralAttributes from "./Manipulation/GeneralAttributes";
import CollectionManipulation from "./Manipulation/CollectionManipulation";
import NodeInsertionInside from "./Manipulation/NodeInsertionInside";
import NodeInsertionOutside from "./Manipulation/NodeInsertionOutside";
import NodeRemoval from "./Manipulation/NodeRemoval";
import Copying from "./Manipulation/Copying";
import Basic from "./Effects/Basic";
import IOption from "./Effects/IOption";
import Module from "./Modules/Module";
import IModule from "../Module/IModule";
import Custom from "./Effects/Custom";
import EventHandlerAttachment from "./Events/EventHandlerAttachment";
import J3Event from "./Events/J3Event";

/**
 * Provides jQuery like API for jThree.
 */
class J3Object extends J3ObjectBase implements
    GomlNodeMethods,
    TreeTraversal,
    Filtering,
    GeneralAttributes,
    CollectionManipulation,
    NodeInsertionInside,
    NodeInsertionOutside,
    NodeRemoval,
    Copying,
    Basic,
    Module,
    Custom,
    EventHandlerAttachment {

    /**
     * Static/Utilities
     */

    /**
     * Iterate array or object.
     *
     * Array is given for first argument, callback function specified for second argument is evaluated for each item in array with index.
     * Object is given for first argument, callback function specified for second argument is evaluated for each value in object with property.
     * J3Object is given for first argument, callback function specified for second argument is evaluated for each targeted node with index.
     * Inside callback function, return true to continue to next iteration, return false to break the iteration loop.
     * If you does not return anything, it behaves same as you returns true.
     * This method is always returns first argument.
     */
    public static each: {
        <T>(array: T[], callback: (indexInArray: number, value: T) => boolean): T;
        <T>(array: T[], callback: (indexInArray: number, value: T) => void): T;
        (j3obj: J3ObjectBase, callback: (indexInArray: number, value: GomlTreeNodeBase) => void): J3ObjectBase;
        <T>(object: { [propertyName: string]: T }, callback: (propertyName: string, valueOfProperty: T) => boolean): { [propertyName: string]: T };
        <T>(object: { [propertyName: string]: T }, callback: (propertyName: string, valueOfProperty: T) => void): { [propertyName: string]: T };
        <T>(argu0: any, callback: (argu1: any, argu2: any) => any): any;
    };

    /**
     * Static/Find
     */

    /**
     * Find a Node from targeted context by query.
     *
     * Query string is same format as the argument of querySelectorAll.
     * If you omission the context specified for second argument, search from root of Node tree.
     */
    public static find: {
        (selector: string, context?: GomlTreeNodeBase): GomlTreeNodeBase[];
    };

    /**
     * Miscellaneous/GomlNodeMethods
     */

    /**
     * Get Nodes.
     *
     * It returns targeted Nodes.
     * If you specified index in first argument, it returns the only specified Node.
     */
    public get: {
        (): GomlTreeNodeBase[];
        (index: number): GomlTreeNodeBase;
        (index?: number): any;
    };

    /**
     * Get target Core Object which Node handles.
     *
     * It returns targeted Core Object in Node.
     * Not all Nodes are handling Core Object, so if it does not have, undefined will be returned.
     * If you specified index in first argument, it returns the only specified Node of Core Object.
     */
    public getObj: {
        <T>(): T[];
        <T>(index: number): T;
        <T>(argu?: number): any;
    };

    /**
     * WIP
     */
    public index: {
        (): number;
        (selector: string): number;
        (node: GomlTreeNodeBase): number;
        (j3obj: J3Object): number;
        (arg?: string | GomlTreeNodeBase | J3Object): number
    };

    public toArray: {
        (): GomlTreeNodeBase[];
    };

    /**
     * Traversing/TreeTraversal
     */

    /**
     * Find children recursively under specified condition.
     *
     * Selector string is given, find by same behavior as querySelectorAll.
     */
    public find: {
        (selector: string): J3Object;
        (node: GomlTreeNodeBase): J3Object;
        (j3obj: J3Object): J3Object;
        (argu: any): J3Object;
    };

    public children: {
        (): J3Object;
        (selector: string): J3Object;
        (argu?: any): any;
    };

    public parent: {
        (): J3Object;
        (selector: string): J3Object;
        (argu?: any): any;
    };

    public parents: {
        (): J3Object;
        (selector: string): J3Object;
        (argu?: any): any;
    };

    public prev: {
        (): J3Object;
        (selector: string): J3Object;
        (argu?: any): any;
    };

    public next: {
        (): J3Object;
        (selector: string): J3Object;
        (argu?: any): any;
    };

    /**
     * Traversing/Filtering
     */

    public filter: {
        (selector: string): J3Object;
        (func: (index: number, node: GomlTreeNodeBase) => boolean): J3Object;
        (node: GomlTreeNodeBase): J3Object;
        (nodes: GomlTreeNodeBase[]): J3Object;
        (nodes: J3Object): J3Object;
        (argu: any): J3Object;
    };

    public eq: {
        (index: number): J3Object;
    };

    public first: {
        (): J3Object;
    };

    public last: {
        (): J3Object;
    };

    public has: {
        (selector: string): J3Object;
        (contained: GomlTreeNodeBase): J3Object;
        (argu: any): J3Object;
    };

    public is: {
        (selector: string): boolean;
        (func: (index: number, node: GomlTreeNodeBase) => boolean): boolean;
        (selection: J3Object): boolean;
        (node: GomlTreeNodeBase): boolean;
        (argu: any): boolean;
    };

    public not: {
        (selector: string): J3Object;
        (node: GomlTreeNodeBase): J3Object;
        (nodes: GomlTreeNodeBase[]): J3Object;
        (func: (index: number, node: GomlTreeNodeBase) => boolean): J3Object;
        (selection: J3Object): J3Object;
        (argu: any): J3Object;
    };

    public slice: {
        (start: number, end: number): J3Object;
    };

    /**
     * Manipulation/GeneralAttributes
     */

    public attr: {
        (attributeName: string): string;
        (attributeName: string, value: any): J3Object;
        (attributes: Object): J3Object;
        (attributeName: string, func: (number, string) => string): J3Object;
        (attributeName: string, func: (number, string) => number): J3Object;
        (argu0: any, argu1?: any): any;
    };

    public attrObj: {
        (attributeName: string): any;
        (attributeName: string, value: any): J3Object;
        (attributes: Object): J3Object;
        (argu0: any, argu1?: any): any;
    };

    /**
     * Manipulation/CollectionManipulation
     */

    public each: {
        (func: (index: number, node: GomlTreeNodeBase) => boolean): J3Object;
    };

    /**
     * Manipulation/NodeInsertionInside
     */

    public append: {
        (...contents: string[]): J3Object;
        (...contents: GomlTreeNodeBase[]): J3Object;
        (...contents: J3Object[]): J3Object;
        (...contents: string[][]): J3Object;
        (...contents: GomlTreeNodeBase[][]): J3Object;
        (...contents: J3Object[][]): J3Object;
        (func: (index: number, goml: string) => string): J3Object;
        (func: (index: number, goml: string) => GomlTreeNodeBase): J3Object;
        (func: (index: number, goml: string) => J3Object): J3Object;
        (...argu: any[]): J3Object;
    };

    public appendTo: {
        (target: string): J3Object;
        (target: GomlTreeNodeBase): J3Object;
        (target: J3Object): J3Object;
        (targets: GomlTreeNodeBase[]): J3Object;
        (targets: J3Object[]): J3Object;
        (argu: any): any;
    };

    public prepend: {
        (...contents: string[]): J3Object;
        (...contents: GomlTreeNodeBase[]): J3Object;
        (...contents: J3Object[]): J3Object;
        (...contents: string[][]): J3Object;
        (...contents: GomlTreeNodeBase[][]): J3Object;
        (...contents: J3Object[][]): J3Object;
        (func: (index: number, goml: string) => string): J3Object;
        (func: (index: number, goml: string) => GomlTreeNodeBase): J3Object;
        (func: (index: number, goml: string) => J3Object): J3Object;
        (...argu: any[]): J3Object;
    };

    public prependTo: {
        (target: string): J3Object;
        (target: GomlTreeNodeBase): J3Object;
        (target: J3Object): J3Object;
        (targets: GomlTreeNodeBase[]): J3Object;
        (targets: J3Object[]): J3Object;
        (argu: any): any;
    };

    /**
     * Manipulation/NodeInsertionOutside
     */

    public after: {
        (...contents: string[]): J3Object;
        (...contents: GomlTreeNodeBase[]): J3Object;
        (...contents: J3Object[]): J3Object;
        (...contents: string[][]): J3Object;
        (...contents: GomlTreeNodeBase[][]): J3Object;
        (...contents: J3Object[][]): J3Object;
        (func: (index: number, goml: string) => string): J3Object;
        (func: (index: number, goml: string) => GomlTreeNodeBase): J3Object;
        (func: (index: number, goml: string) => J3Object): J3Object;
        (...argu: any[]): J3Object;
    };

    public insertAfter: {
        (target: string): J3Object;
        (target: GomlTreeNodeBase): J3Object;
        (target: J3Object): J3Object;
        (targets: GomlTreeNodeBase[]): J3Object;
        (targets: J3Object[]): J3Object;
        (argu: any): any;
    };

    public before: {
        (...contents: string[]): J3Object;
        (...contents: GomlTreeNodeBase[]): J3Object;
        (...contents: J3Object[]): J3Object;
        (...contents: string[][]): J3Object;
        (...contents: GomlTreeNodeBase[][]): J3Object;
        (...contents: J3Object[][]): J3Object;
        (func: (index: number, goml: string) => string): J3Object;
        (func: (index: number, goml: string) => GomlTreeNodeBase): J3Object;
        (func: (index: number, goml: string) => J3Object): J3Object;
        (...argu: any[]): J3Object;
    };

    public insertBefore: {
        (target: string): J3Object;
        (target: GomlTreeNodeBase): J3Object;
        (target: J3Object): J3Object;
        (targets: GomlTreeNodeBase[]): J3Object;
        (targets: J3Object[]): J3Object;
        (argu: any): any;
    };

    /**
     * Manipulation/NodeRemoval
     */

    public remove: {
        (): J3Object;
        (filter: string): J3Object;
        (argu?: string): any;
    };

    /**
     * Manipulation/Copying
     */

    public clone: {
        (): J3Object;
        (withEvents: boolean): J3Object;
        (withEvents: boolean, deepWithEvents: boolean): J3Object;
        (argu0?: any, argu1?: any): J3Object;
    };

    /**
     * Effects/Basic
     */

    public show: {
        (): J3Object;
        (option: IOption): J3Object;
        (duration: number): J3Object;
        (duration: string): J3Object;
        (complete: () => void): J3Object;
        (duration: number, complete: () => void): J3Object;
        (duration: string, complete: () => void): J3Object;
        (duration: number, easing: string): J3Object;
        (duration: string, easing: string): J3Object;
        (duration: number, easing: string, complete: () => void): J3Object;
        (duration: string, easing: string, complete: () => void): J3Object;
        (argu0?: any, argu1?: any, argu2?: any): any;
    };

    public hide: {
        (): J3Object;
        (option: IOption): J3Object;
        (duration: number): J3Object;
        (duration: string): J3Object;
        (complete: () => void): J3Object;
        (duration: number, complete: () => void): J3Object;
        (duration: string, complete: () => void): J3Object;
        (duration: number, easing: string): J3Object;
        (duration: string, easing: string): J3Object;
        (duration: number, easing: string, complete: () => void): J3Object;
        (duration: string, easing: string, complete: () => void): J3Object;
        (argu0?: any, argu1?: any, argu2?: any): any;
    };

    /**
     * Effects/Custom
     */

    public animate: {
        (properties: { [key: string]: string }): J3Object;
        (properties: { [key: string]: string }, option: IOption): J3Object;
        (properties: { [key: string]: string }, duration: number): J3Object;
        (properties: { [key: string]: string }, duration: string): J3Object;
        (properties: { [key: string]: string }, complete: () => void): J3Object;
        (properties: { [key: string]: string }, duration: number, complete: () => void): J3Object;
        (properties: { [key: string]: string }, duration: string, complete: () => void): J3Object;
        (properties: { [key: string]: string }, duration: number, easing: string): J3Object;
        (properties: { [key: string]: string }, duration: string, easing: string): J3Object;
        (properties: { [key: string]: string }, duration: number, easing: string, complete: () => void): J3Object;
        (properties: { [key: string]: string }, duration: string, easing: string, complete: () => void): J3Object;
        (properties: { [key: string]: string }, argu0?: any, argu1?: any, argu2?: any): any;
    };

    /**
     * Modules/Module
     */

    public module: {
        (): IModule[];
        (module: new () => IModule): IModule[];
        (argu?: any): any;
    };

    /**
     * Events/EventHandlerAttachment
     */

    public on: {
        (event: string, handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
        (event: string, selector: string, handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
        (event: string, data: { [key: string]: any }, handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
        (event: string, data: any[], handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
        (event: string, selector: string, data: { [key: string]: any }, handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
        (event: string, selector: string, data: any[], handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
        (events: { [key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void }): J3Object;
        (events: { [key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void }, selector: string): J3Object;
        (events: { [key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void }, data: { [key: string]: any }): J3Object;
        (events: { [key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void }, data: any[]): J3Object;
        (events: { [key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void }, selector: string, data: { [key: string]: any }): J3Object;
        (events: { [key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void }, selector: string, data: any[]): J3Object;
        (event: string, handler: boolean): J3Object;
        (event: string, selector: string, handler: boolean): J3Object;
        (event: string, data: { [key: string]: any }, handler: boolean): J3Object;
        (event: string, data: any[], handler: boolean): J3Object;
        (event: string, selector: string, data: { [key: string]: any }, handler: boolean): J3Object;
        (event: string, selector: string, data: any[], handler: boolean): J3Object;
        (events: { [key: string]: boolean }): J3Object;
        (events: { [key: string]: boolean }, selector: string): J3Object;
        (events: { [key: string]: boolean }, data: { [key: string]: any }): J3Object;
        (events: { [key: string]: boolean }, data: any[]): J3Object;
        (events: { [key: string]: boolean }, selector: string, data: { [key: string]: any }): J3Object;
        (events: { [key: string]: boolean }, selector: string, data: any[]): J3Object;
        (argu0: any, argu1?: any, argu2?: any, argu3?: any): any;
    };

    public off: {
        (events: string, selector: string, handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
        (events: string, handler: (eventObject: J3Event, ...extraParameter: any[]) => void): J3Object;
        (events: string, selector: string): J3Object;
        (events: string): J3Object;
        (events: { [key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void }, selector: string): J3Object;
        (events: { [key: string]: (eventObject: J3Event, ...extraParameter: any[]) => void }): J3Object;
        (): J3Object;
        (argu0?: any, argu1?: any, argu2?: any): any;
    };

    /**
     * Construct J3Object from Node.
     * @param {GomlTreeNodeBase} node [description]
     */
    constructor(node: GomlTreeNodeBase);
    /**
     * Construct J3Object from Nodes.
     * @param {GomlTreeNodeBase[]} nodes [description]
     */
    constructor(nodes: GomlTreeNodeBase[]);
    /**
     * Construct J3Object from selector query.
     * @param {string} query [description]
     */
    constructor(query: string);
    /**
     * Construct J3Object from Nodes or selector query.
     * @param {GomlTreeNodeBase[]} nodes [description]
     */
    constructor(argu: any) {
        super();
        let nodes: GomlTreeNodeBase[];
        let query: string;
        switch (true) {
            case (argu == null):
                nodes = [];
                break;
            case (isString(argu)):
                if ((<string>argu).charAt(0) === "<") {
                    const parseObj = new XMLParser(<string>argu);
                    nodes = parseObj.elements.map((elem) => {
                        return GomlParser.parse(elem, NodeManager.configurator);
                    });
                } else {
                    query = argu;
                }
                break;
            case (argu instanceof GomlTreeNodeBase):
                nodes = [argu];
                break;
            case (isArray(argu) && (<GomlTreeNodeBase[]>argu).every((v) => v instanceof GomlTreeNodeBase)):
                nodes = argu;
                break;
            default:
                throw new Error("Argument type is not correct");
        }
        if (nodes) {
            this.__setArray(nodes);
        } else if (query) {
            this.__setArray(J3Object.find(query));
        }
    }
}

export default J3Object;
