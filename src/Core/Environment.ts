import { GrimoireInterface } from "../Tool/Types";

/**
 * Environment manager
 */
export class Environment {

  /**
   * global document object
   */
  public document: Document;

  /**
   * Node object.
   */
  public Node: any;
  /**
   * DomParser
   */
  public DomParser: DOMParser;

  /**
   * XMLSerializer.
   */
  public XMLSerializer: XMLSerializer;

  /**
   * GrimoireInterface
   */
  public GrimoireInterface: GrimoireInterface;
}

export default new Environment();
