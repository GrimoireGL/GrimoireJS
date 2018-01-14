import IParametricObject from "../Interface/IParametricObject";
import Component from "./Component";
import Attribute from "./Attribute";
import { Nullable } from "../Tool/Types";

export default class ParametricObjectContext {
    constructor(public target: IParametricObject, public component: Component, public baseName: string, public nameToKey: { [key: string]: string | ParametricObjectContext }) {

    }

    public getAttributeRaw<T = any>(name: string): Nullable<Attribute<T>> {
        return this.component.getAttributeRaw<T>(this._ensureFQN(name));
    }

    public getAttribute<T = any>(name: string): T {
        return this.component.getAttribute(this._ensureFQN(name));
    }

    public setAttribute<T = any>(name: string, val: T): void {
        this.component.setAttribute(this._ensureFQN(name), val);
    }

    public bindAttributes(target: any = this.target): void {
        for (let name in this.nameToKey) {
            const key = this.nameToKey[name];
            if (typeof key === "string") {
                this.component.getAttributeRaw(key)!.bindTo(name, target);
            }
        }
    }

    private _ensureFQN(name: string): string {
        const fqnOrCop = this.nameToKey[name];
        if (typeof fqnOrCop === "string") {
            return fqnOrCop;
        } else {
            throw new Error(`${name} is not valid for this parametric object`);
        }
    }
}