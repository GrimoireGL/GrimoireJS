import { GrimoireInterface } from "../Tools/Types";

export class Environment {
  public document: Document;
  public Node: any;
  public DomParser: DOMParser;
  public XMLSerializer: XMLSerializer;
  public GrimoireInterface: GrimoireInterface;
}

export default new Environment();
