import GomlAttribute = require("./GomlAttribute");
import AttributeDeclarationBody = require("./AttributeDeclationBody");
/**
 * The interface for declare attribute speciied in GOML.
 */
interface AttributeDeclation {
	/**
	 * Attribute name, user will use this name as tagname in GOML.
	 */
  [name: string]: AttributeDeclarationBody;
}

export = AttributeDeclation;
