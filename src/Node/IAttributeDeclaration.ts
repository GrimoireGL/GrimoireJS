import NSIdentity from "../Base/NSIdentity";
interface IAttributeDeclaration {
  converter: string | NSIdentity;
  default: any;
  readonly?: boolean;

  /**
   * set TRUE if this attribute should be lazy evaluation.
   * @type {[type]}
   */
  lazy?: boolean;
  [parameters: string]: any;
}

export default IAttributeDeclaration;
