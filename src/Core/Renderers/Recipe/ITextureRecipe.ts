import NamedValue from "../../../Base/NamedValue";
/**
 * Provide the information how texture should be created.
 */
interface ITextureRecipe {
    /**
     * The name of texture being created.
     */
    name: string;

    /**
     * The generater type.
     */
    generater: string;

    /**
     * The other parameters which will be passed into generater.
     */
    params: NamedValue<string>;
}

export default ITextureRecipe;
