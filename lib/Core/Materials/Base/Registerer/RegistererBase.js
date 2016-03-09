import Q from "q";
/**
 * Uniform variable registerer base. This class process uniform variables with '_' as initial.
 *
 * Uniform変数の登録クラスの基底クラス。このクラスは_から始まる変数名を持つuniform変数を処理する。
 */
class RegistererBase {
    /**
     * Preprocessing for uniform variables.
     * @param {WebGLRenderingContext}   gl       [description]
     * @param {ProgramWrapper}          pWrapper [description]
     * @param {IVariableDescription }}      uniforms      [description]
     */
    preprocess(pass, uniforms) {
        const defer = Q.defer();
        process.nextTick(() => {
            defer.resolve(null);
        });
        return defer.promise;
    }
}
export default RegistererBase;
