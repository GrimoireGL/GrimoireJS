import IDisposable from "../../Base/IDisposable";
import JThreeObject from "../../Base/JThreeObject";
import ContextManager from "../Canvas/Canvas";
import JThreeEvent from "../../Base/JThreeEvent";
import {Action2} from "../../Base/Delegates";
class ResourceWrapper extends JThreeObject implements IDisposable {

  protected __onInitializeChangedEvent: JThreeEvent<boolean> = new JThreeEvent<boolean>();
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
   * add event handler for changing initialized state changed.
   */
  public onInitializeChanged(handler: Action2<ResourceWrapper, boolean>): void {
    this.__onInitializeChangedEvent.addListener(handler);
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
    this.__onInitializeChangedEvent.fire(this, initialized);
  }

}

export default ResourceWrapper;
