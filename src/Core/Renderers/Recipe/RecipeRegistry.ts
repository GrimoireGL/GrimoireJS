import NamedValue from "../../../Base/NamedValue";
class RecipeRegistry {
    private static _recipes: NamedValue<string>;

    public static appendRecipe(name: string, source: string): void {
        RecipeRegistry._checkInitialized();
        RecipeRegistry._recipes[name] = source;
    }

    public static getRecipe(name: string): string {
        RecipeRegistry._checkInitialized();
        return RecipeRegistry._recipes[name];
    }

    private static _checkInitialized(): void {
        if (!RecipeRegistry._recipes) {
            RecipeRegistry._recipes = {
                default: require("./BuiltIn/DefaultRecipe.xml")
            };
        }
    }
}

export default RecipeRegistry;
