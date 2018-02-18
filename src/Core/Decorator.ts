import IConverterDeclaration from "../Interface/IAttributeConverterDeclaration";
import { Name } from "../Tool/Types";
import Component from "./Component";

/**
 * Annotate that the property is Attribute.
 * @param converter converter
 * @param defaults default value
 * @param options addtional attribute params
 */
export function attribute(converter: Name | IConverterDeclaration, defaults: any, options?: Object) {
    options = options || {};
    return function decolator(target: Component, name: string) {
        if (!(target.constructor as any).hasOwnProperty("attributes")) {
            (target.constructor as any)["attributes"] = {};
        }
        const attrs = (target.constructor as any)["attributes"];
        if (attrs[name]) {
            throw Error(`attribute ${name} is already defined in ${target.constructor.name}`);
        }
        attrs[name] = {
            converter,
            default: defaults,
            ...options,
        };

        if (!target.hasOwnProperty("hooks")) {
            target.hooks = [];
        }
        target.hooks!.push((self: Component) => {
            const a = self.getAttributeRaw(name);
            a.bindTo(name, self);
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
        if (!target.hasOwnProperty("hooks")) {
            target.hooks = [];
        }
        target.hooks!.push((self: Component) => {
            (self.getAttributeRaw(attributeName) as any).watch((newValue: any, oldValue: any, attr: any) => {
                (self as any)[name](newValue, oldValue, attr);
            }, immedateCalls, ignoireActiveness);
        });
    };
}
