import NamedValue from "../../../Base/NamedValue";
import IXMMLPassDescription from "../../Materials/Parser/IXMMLPassDescription";
import IVariableDescription from "../../ProgramTransformer/Base/IVariableDescription";
import IApplyMaterialArgument from "../../Materials/IApplyMaterialArgument";
import ProgramWrapper from "../../Resources/Program/ProgramWrapper";
import Q from "q";
/**
 * Uniform variable registerer base. This class process uniform variables with '_' as initial.
 *
 * Uniform変数の登録クラスの基底クラス。このクラスは_から始まる変数名を持つuniform変数を処理する。
 */
abstract class RegistererBase {
  /**
   * Obtain the specific name for this registerer.
   * @return {string} specific name for registerer.
   */
  public abstract getName(): string;

  /**
   * Process registering for uniform variables
   * @param {WebGLRenderingContext}   gl       [description]
   * @param {ProgramWrapper}          pWrapper [description]
   * @param {IApplyMaterialArgument}  matArg   [description]
   * @param {IVariableDescription }}      uniforms      [description]
   */
  public abstract register(gl: WebGLRenderingContext, pWrapper: ProgramWrapper, matArg: IApplyMaterialArgument, uniforms: NamedValue<IVariableDescription>): void;

  /**
   * Preprocessing for uniform variables.
   * @param {WebGLRenderingContext}   gl       [description]
   * @param {ProgramWrapper}          pWrapper [description]
   * @param {IVariableDescription }}      uniforms      [description]
   */
  public preprocess(pass: IXMMLPassDescription, uniforms: NamedValue<IVariableDescription>): Q.IPromise<void> {
    const defer = Q.defer<void>();
    process.nextTick(() => {
      defer.resolve(null);
    });
    return defer.promise;
  }
}

export default RegistererBase;
