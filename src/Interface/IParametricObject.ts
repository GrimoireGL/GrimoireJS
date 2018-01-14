import Component from "../Core/Component";
import IAttributeDeclaration from "./IAttributeDeclaration";
import ParametricObjectContext from "../Core/ParametricObjectContext";

export default interface IParametricObject {
    owner?: Component;
    getAttributeDeclarations(): { [key: string]: IAttributeDeclaration | IParametricObject };
    onAttachComponent(component: Component, ctx: ParametricObjectContext): void;
    onDetachComponent(lastComponent: Component, ctx: ParametricObjectContext): void;
}