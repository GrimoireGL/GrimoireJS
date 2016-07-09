import NamedValue from "../Base/NamedValue";
interface INodeRecipe {
    name: string;
    namespace: string;
    requiredComponents: string[];
    requiredComponentsForChildren: string[];
    defaultAttributes: NamedValue<any>;
}

export default INodeRecipe;
