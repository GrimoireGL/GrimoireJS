import { IAttributeDeclaration, ILazyAttributeDeclaration, IStandardAttributeDeclaration } from "../Interface/IAttributeDeclaration";
import Attribute, { LazyAttribute, StandardAttribute } from "./Attribute";
import Component from "./Component";
import Namespace from "./Namespace";

export class AttributeNamespace {
    public ns: Namespace;
    public children: AttributeNamespace[] = [];
    public attributes: Attribute[] = [];
    public nsMap: { [key: string]: Attribute | AttributeNamespace } = {};

    constructor(
        public component: Component,
        public baseName: string,
        public addAttributeFunc: Component["__addAttribute"],
    ) {
        this.ns = Namespace.define(baseName);
    }

    public addAttribute(name: string, attribute: IStandardAttributeDeclaration): StandardAttribute;
    public addAttribute(name: string, attribute: ILazyAttributeDeclaration): LazyAttribute;
    public addAttribute(name: string, attribute: IAttributeDeclaration): Attribute {
        const attr = this.addAttribute(this.ns.extend(name).qualifiedName, attribute as any);
        this.nsMap[name] = attr;
        return attr;
    }

    public removeAttributes(name?: string): void {
        if (!name) {
            for (const key in this.nsMap) {
                const attr = this.nsMap[key];
                if (attr instanceof AttributeNamespace) {
                    attr.removeAttributes();
                } else {
                    this.component.node.removeAttribute(attr);
                }
            }
            this.nsMap = {};
        } else {
            const attr = this.nsMap[name];
            if (attr instanceof AttributeNamespace) {
                attr.removeAttributes();
            } else {
                this.component.node.removeAttribute(attr);
            }
            delete this.nsMap[name];
        }
    }

    public createSubNamespace(baseName: string): AttributeNamespace {
        const child = new AttributeNamespace(
            this.component,
            this.ns.extend(baseName).qualifiedName,
            this.addAttributeFunc,
        );
        this.nsMap[baseName] = child;
        return child;
    }

}

export default AttributeNamespace;
