import ProgramTransformer from "./ProgramTransformer";
import Q from "q";

class SourceTransformer extends ProgramTransformer {
    constructor(sourceTransformer: (string) => Q.IPromise<string>) {
        super(async (input) => {
            const trans = await sourceTransformer(input.transformSource);
            return {
                initialSource: input.initialSource,
                transformSource: trans,
                description: input.description
            };
        });
    }
}

export default SourceTransformer;
