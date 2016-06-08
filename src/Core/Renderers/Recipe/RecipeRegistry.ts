import NamedValue from "../../../Base/NamedValue";
class RecipeRegistry {
    private static _recipes: NamedValue<string> = {
        default: require("./BuiltIn/DefaultRecipe.xml")
    };

    public static appendRecipe(name: string, source: string): void {
        RecipeRegistry._recipes[name] = source;
    }

    public static getRecipe(name: string): string {
        return RecipeRegistry._recipes[name];
    }
}

export default RecipeRegistry;
