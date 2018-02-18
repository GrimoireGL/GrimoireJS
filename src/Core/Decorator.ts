import Component from "./Component";

export function attribute(converter: any, defaults: any, options?: Object) {
    options = options || {};
    return function decolator(target: Component, name: string) {
        // debugger;
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

export function companion(key: string) {
    return function decolator(target: Component, name: string) {
        // debugger;
        if (target.hooks === undefined) {
            target.hooks = [];
        }
        target.hooks.push(async(self: Component) => {
            const v = await self.companion.waitFor(key);
            (self as any)[name] = v;
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
