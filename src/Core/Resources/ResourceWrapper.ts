import IDisposable from "../../Base/IDisposable";
import JThreeObjectEE from "../../Base/JThreeObjectEE";
import ContextManager from "../Canvas/Canvas";
class ResourceWrapper extends JThreeObjectEE implements IDisposable {

  /**
   * Whether this resource was initialized for this context or not.
   */
  private _initialized: boolean;
  private _ownerCanvas: ContextManager;

  constructor(ownerCanvas: ContextManager) {
    super();
    this._ownerCanvas = ownerCanvas;
  }

  public dispose(): void {
    return;
  }
  /**
  * The canvas hold this resource.
  */
  public get OwnerCanvas(): ContextManager {
    return this._ownerCanvas;
  }

  /**
  * The ID string for identify which canvas manager holds this resource.
  */
  public get OwnerID(): string {
    return this._ownerCanvas.id;
  }

  public get GL() {
    return this._ownerCanvas.gl;
  }

  /**
  * Getter for whether this resource was initialized for this context or not.
  */
  public get Initialized(): boolean {
    return this._initialized;
  }

  public init(): void {
    return;
  }

  protected __setInitialized(initialized?: boolean): void {
    if (typeof initialized === "undefined") { initialized = true; }
    if (initialized === this._initialized) { return; }
    this._initialized = initialized;
    this.emit("initialized", initialized);
  }

}

export default ResourceWrapper;
