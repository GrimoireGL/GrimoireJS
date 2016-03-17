/**
 * Parser for XML
 */
class XMLParser {
  /**
   * parsed document.
   * @type {Document}
   */
  private _doc: Document;

  /**
   * parsed elements.
   * @type {HTMLElement[]}
   */
  private _elements: HTMLElement[];

  /**
   * get source xml.
   * @type {string}
   */
  private _xml: string;

  /**
   * XMLParserError object.
   * @type {XMLParserError}
   */
  private _error: XMLParserError;

  /**
   * parse xml. By default, multiple root element is available.
   * @param {string}  xml    xml string for parse.
   * @param {boolean} nowrap If this flag is true, root element must be single element.
   */
  constructor(xml: string, nowrap?: boolean) {
    this._xml = xml;
    this._doc = (new DOMParser()).parseFromString(xml, "text/xml");
    if (!nowrap) {
      this._updateError();
      if (!this._error.all) {
        this._elements = [this._doc.documentElement];
      } else if (this._error.message === "Extra content at the end of the document") {
        this._doc = (new DOMParser()).parseFromString(`<root>${xml}</root>`, "text/xml");
        this._updateError();
        if (this.isValid) {
          this._elements = Array.prototype.slice.call(this._doc.documentElement.childNodes);
        } else {
          this._elements = void 0;
        }
      }
    }
  }

  /**
   * get root elements.
   * @return {HTMLElement[]} root elements
   */
  public get elements(): HTMLElement[] {
    return this._elements;
  }

  /**
   * get true if parsed xml id valid.
   * @return {boolean} valid or not
   */
  public get isValid(): boolean {
    return !this.error;
  }

  /**
   * get XMLParserError.
   * @return {XMLParserError} XMLParserError object.
   */
  public get error(): XMLParserError {
    if (!this._error) {
      this._updateError();
    }
    if (this._error.all) {
      return this._error;
    } else {
      return;
    }
  }

  /**
   * get original xml string.
   * @return {string} xml string
   */
  public get xml(): string {
    return this._xml;
  }

  private _updateError(): void {
    this._error = new XMLParserError(this._doc);
  }
}

export class XMLParserError {
  /**
   * whole error message.
   * @type {string}
   */
  private _all: string;

  /**
   * message part of error.
   * @type {string}
   */
  private _message: string;

  constructor(doc: Document) {
    const parsererrorElement: any = doc.querySelector("parsererror div");
    if (parsererrorElement) {
      this._all = (<HTMLElement>parsererrorElement).innerHTML.replace(/^\s+|\s+$/g, "");
      this._message = this._all.match(/^.+?:\s?(.+)$/)[1];
    }
  }

  /**
   * get whole error message.
   * @return {string} error message string.
   */
  public get all(): string {
    return this._all;
  }

  /**
   * get message part of error.
   * @return {string} error message string.
   */
  public get message(): string {
    return this._message;
  }
}

export default XMLParser;
