/**
 * Parser for XML
 */
class XMLParser {
  /**
   * parsed document
   * @type {Document}
   */

  private _doc: Document;
  /**
   * get source xml
   * @type {string}
   */
  private _xml: string;

  /**
   * parse xml
   * @param {string} xml xml string for parse
   */
  constructor(xml: string) {
    this._xml = xml;
    this._doc = (new DOMParser()).parseFromString(xml, "text/xml")
  }

  /**
   * get root element
   * @return {Element} root element
   */
  public get element(): Element {
    return this.doc.documentElement;
  }

  /**
   * get true if parsed xml id valid.
   * @return {boolean} valid or not
   */
  public get isValid(): boolean {
    return !this.doc.querySelector("parsererror");
  }

  /**
   * get original xml string
   * @return {string} [description]
   */
  public get xml(): string {
    return this._xml;
  }

  /**
   * get parsed document
   * @return {Document} [description]
   */
  public get doc(): Document {
    return this._doc;
  }
}

export default XMLParser;
