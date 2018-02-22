import IConverterDeclaration from "../Interface/IAttributeConverterDeclaration";
import { Ctor, Name, Nullable } from "../Tool/Types";
import Component from "./Component";

/**
 * Annotate that the property is Attribute.
 * @param converter converter
 * @param defaults default value
 * @param options addtional attribute params
 */
export function attribute(converter: Name | IConverterDeclaration, defaults: any, attributeName: Nullable<string> = null, options?: Object) {
    options = options || {};
    return function decolator(target: Component, name: string) {
        const _attributeName = attributeName || name;
        if (!(target.constructor as any).hasOwnProperty("attributes")) {
            (target.constructor as any)["attributes"] = {};
        }
        const attrs = (target.constructor as any)["attributes"];
        if (attrs[_attributeName]) {
            throw Error(`attribute ${_attributeName} is already defined in ${target.constructor.name}`);
        }
        attrs[_attributeName] = {
            converter,
            default: defaults,
            ...options,
        };

        if (!target.hasOwnProperty("hooks")) {
            target.hooks = [];
        }
        target.hooks!.push((self: Component) => {
            self.getAttributeRaw(_attributeName).bindTo(name, self);
        });
    };
}

/**
 * Insert custom logic to getter.
 * This decorator is used with @attribute
 * @param func function to proxy getter
 */
export function overrideGetter(func: (value: any) => any) {
    return function decolator(target: Component, name: string) {
        if (!target.hasOwnProperty("hooks")) {
            target.hooks = [];
        }
        target.hooks!.push((self: Component) => {
            const descriptor = Object.getOwnPropertyDescriptor(self, name);
            Object.defineProperty(self, name, {
                ...descriptor,
                get: func(descriptor.get()),
            });
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
        if (!target.hasOwnProperty("hooks")) {
            target.hooks = [];
        }
        target.hooks!.push((self: Component) => {
            const a = self.companion.get(key);
            if (a == null) {
                (async function () {
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
        ensureHooks(target);
        target.hooks!.push((self: Component) => {
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
        ensureHooks(target);
        target.hooks!.push((self: Component) => {
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
        ensureHooks(target);
        target.hooks!.push((self: Component) => {
            (self as any)[name] = self.node.getComponentInAncestor(componentName, mandatory as any);
        });
    };
}

function ensureHooks(target: Component) {
    if (!target.hasOwnProperty("hooks")) {
        target.hooks = [];
    }
}
