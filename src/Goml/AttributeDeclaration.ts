import AttributeDeclarationBody from "./AttributeDeclationBody";
/**
 * The interface for declare attribute speciied in GOML.
 */
interface AttributeDeclation {
	/**
	 * Attribute name, user will use this name as tagname in GOML.
	 */
  [name: string]: AttributeDeclarationBody;
}

export default AttributeDeclation;
