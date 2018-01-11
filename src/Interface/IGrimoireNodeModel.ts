import IGrimoireComponentModel from "./IGrimoireComponentModel";

/**
 * Grimoire Object Model structure slement
 */
export default interface IGrimoireNodeModel {
  name: string;
  attributes?: { [key: string]: string; };
  optionalComponents?: IGrimoireComponentModel[];
  children?: IGrimoireNodeModel[];
}
