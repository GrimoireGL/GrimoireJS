import IConverterDeclaration from "../Interface/IAttributeConverterDeclaration";
import { Ctor, Name, Nullable } from "../Tool/Types";
import Component from "./Component";

export type ComponentPropertyDecorator = (target: Component, name: string) => void;

function addHook(target: Component, message: string, callback: (self: Component) => void) {
    if (!target.hasOwnProperty("hooks")) {
        target.hooks = {};
    }
    if (!target.hooks[message]) {
        target.hooks[message] = [];
    }
    const hooks = target.hooks[message];
    hooks.push(callback);
}

/**
 * Annotate that the property is Attribute.
 * @param converter converter
 * @param defaults default value
 * @param options addtional attribute params
 */
export function attribute(converter: Name | IConverterDeclaration, defaults: any): ComponentPropertyDecorator;
export function attribute(converter: Name | IConverterDeclaration, defaults: any, attributeName: string): ComponentPropertyDecorator;
export function attribute(converter: Name | IConverterDeclaration, defaults: any, options: Object): ComponentPropertyDecorator;
export function attribute(converter: Name | IConverterDeclaration, defaults: any, attributeName: string, options: Object): ComponentPropertyDecorator;
export function attribute(converter: Name | IConverterDeclaration, defaults: any, attributeName?: string | Object, options?: Object): ComponentPropertyDecorator {
    let _options: Object = {};
    let _attributeName: string | null = null;
    if (options != null) {// 4th overload
        _options = options;
        _attributeName = attributeName as string;
    } else if (attributeName == null) {// 1st overload
        _attributeName = null;
    } else if (typeof attributeName === "object" && attributeName !== null) {// 3rd overload
        _options = attributeName;
    } else { // 2nd overload
        _attributeName = attributeName as string;
    }
    return function decolator(target: Component, name: string) {
        const __attributeName = _attributeName || name; // if attributeName is not given, use `name`
        if (!(target.constructor as any).hasOwnProperty("attributes")) {
            (target.constructor as any)["attributes"] = {};
        }
        const attrs = (target.constructor as any)["attributes"];
        if (attrs[__attributeName]) {
            throw Error(`attribute ${__attributeName} is already defined in ${target.constructor.name}`);
        }
        attrs[__attributeName] = {
            converter,
            default: defaults,
            ..._options,
        };

        addHook(target, "awake", (self: Component) => {
            self.getAttributeRaw(__attributeName).bindTo(name, self);
        });
    };
}

/**
 * Annotate that the property binds to companion value.
 * the property will be set on value is set to companion.
 * @param key companion key
 */
export function companion(key: Name) {
    return function decolator(target: Component, name: string) {

        addHook(target, "awake", (self: Component) => {
            const a = self.companion.get(key);
            if (a == null) {
                (async function() {
                    const v = await self.companion.waitFor(key);
                    (self as any)[name] = v;
                })();
            } else {
                (self as any)[name] = a;
            }
        });
    };
}

/**
 * Annotate that function called when change attribute values.
 * @param attributeName attribute name or identity
 * @param immedateCalls
 * @param ignoireActiveness
 */
export function watch(attributeName: Name, immedateCalls = false, ignoireActiveness = false) {
    return function decorator(target: Component, name: string) {
        addHook(target, "awake", (self: Component) => {
            (self.getAttributeRaw(attributeName) as any).watch((newValue: any, oldValue: any, attr: any) => {
                (self as any)[name](newValue, oldValue, attr);
            }, immedateCalls, ignoireActiveness);
        });
    };
}

/**
 * Decorator for fetching component included in current node automatically.
 * @param componentName name to identify component. String or constructor of a component
 * @param mandatory flag to note this component must be existing
 */
export function component(componentName: string | Ctor<Component>, mandatory = true) {
    return function decorator(target: Component, name: string) {
        addHook(target, "awake", (self: Component) => {
            (self as any)[name] = self.node.getComponent(componentName, mandatory as any);
        });
    };
}

/**
 * Decorator for fetching component included in ancestor node automatically.
 * @param componentName name to identify component. String or constructor of a component
 * @param mandatory flag to note this component must be existing
 */
export function componentInAncestor(componentName: string | Ctor<Component>, mandatory = true) {
    return function decorator(target: Component, name: string) {
        addHook(target, "awake", (self: Component) => {
            (self as any)[name] = self.node.getComponentInAncestor(componentName, mandatory as any);
        });
    };
}
