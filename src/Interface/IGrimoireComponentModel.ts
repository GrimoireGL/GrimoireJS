/**
 * Grimoire Object Model structure slement
 */
export default interface IGrimoireComponentModel {
  name: string;
  attributes?: { [key: string]: string; };
}
