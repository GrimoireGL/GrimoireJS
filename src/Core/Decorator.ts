import { IAttributeDeclaration } from "../Interface/IAttributeDeclaration";
import { Name } from "../Tool/Types";
import Component from "./Component";

/**
 * Annotate that the property is Attribute.
 * @param converter converter
 * @param defaults default value
 * @param options addtional attribute params
 */
export function attribute(converter: Name | IAttributeDeclaration, defaults: any, options?: Object) {
    options = options || {};
    return function decolator(target: Component, name: string) {
        let attrs = (target.constructor as any)["attributes"];
        if (!attrs) {
            attrs = {};
            (target.constructor as any)["attributes"] = attrs;
        } else {
            if (attrs[name]) {
                throw Error(`attribute ${name} is already defined in ${target.constructor.name}`);
            }
        }

        attrs[name] = {
            converter,
            default: defaults,
            ...options,
        };
        if (target.hooks === undefined) {
            target.hooks = [];
        }
        target.hooks.push((self: Component) => {
            const a = self.getAttributeRaw(name);
            a.bindTo(name, self);
        });
    };
}

/**
 * Annotate that the property binds to companion value.
 * the property
 * @param key
 */
export function companion(key: string) {
    return function decolator(target: Component, name: string) {
        if (target.hooks === undefined) {
            target.hooks = [];
        }
        target.hooks.push((self: Component) => {
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

export function watch(attributeName: string, immedateCalls = false, ignoireActiveness = false) {
    return function decorator(target: Component, name: string) {
        if (target.hooks === undefined) {
            target.hooks = [];
        }
        target.hooks.push((self: Component) => {
            (self.getAttributeRaw(attributeName) as any).watch((newValue: any, oldValue: any, attr: any) => {
                (self as any)[name](newValue, oldValue, attr);
            }, immedateCalls, ignoireActiveness);
        });
    };
}
