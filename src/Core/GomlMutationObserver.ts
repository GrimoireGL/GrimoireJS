import * as Utility from "../Tool/Utility";
import Environment from "./Environment";

/**
 * this class observe mutation dom for detect late added goml or removed goml.
 */
export default class GomlMutationObserver {

  private _mutationObserver?: MutationObserver;

  /**
   * this is observing goml or not.
   */
  public get isObserving(): boolean {
    return !!this._mutationObserver;
  }

  /**
   * start observing goml
   * @param addedObserver
   * @param removedObserver
   */
  public startObservation(addedObserver: (scriptTag: Element) => void, removedObserver: (scriptTag: Element) => void) {
    if (this._mutationObserver) {
      throw new Error("observation is already started");
    }
    this._mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        Array.from(mutation.addedNodes).forEach(it => {
          if (it.localName === "script" && Utility.isElement(it) && it.getAttribute("type") === "text/goml") {
            addedObserver(it);
          }
        });

        Array.from(mutation.addedNodes).forEach(it => {
          if (it.localName === "script" && Utility.isElement(it) && it.getAttribute("type") === "text/goml") {
            removedObserver(it);
          }
        });

      });
    });
    const option = {
      childList: true,
      subtree: true,
    };
    this._mutationObserver.observe(Environment.document.body, option);

  }

  /**
   * stop observation
   */
  public stopObservation() {
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = undefined;
    }
  }
}
