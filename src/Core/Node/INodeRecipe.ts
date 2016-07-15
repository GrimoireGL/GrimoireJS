interface INodeRecipe {
    name: string;
    namespace: string;
    requiredComponents: string[];
    requiredComponentsForChildren: string[];
    defaultAttributes: { [key: string]: any; };
}

export default INodeRecipe;
