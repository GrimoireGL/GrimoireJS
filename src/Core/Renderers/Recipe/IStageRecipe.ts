import NamedValue from "../../../Base/NamedValue";
interface IStageRecipe {
    stage: string;

    buffers: NamedValue<string>;

    variables: NamedValue<string>;
}

export default IStageRecipe;
