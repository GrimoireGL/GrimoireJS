import IDisposable from "../../Base/IDisposable";
import JThreeObject from "../../Base/JThreeObject";
import ContextManager from "../Canvas/Canvas";
import JThreeEvent from "../../Base/JThreeEvent";
import {Action2} from "../../Base/Delegates";
class ResourceWrapper extends JThreeObject implements IDisposable {

  protected onInitializeChangedEvent: JThreeEvent<boolean> = new JThreeEvent<boolean>();
  /**
   * Whether this resource was initialized for this context or not.
   */
  private initialized: boolean;
  private ownerCanvas: ContextManager;

  constructor(ownerCanvas: ContextManager) {
    super();
    this.ownerCanvas = ownerCanvas;
  }

  public dispose() {
    return;
  }
  /**
  * The canvas hold this resource.
  */
  public get OwnerCanvas(): ContextManager {
    return this.ownerCanvas;
  }

  /**
  * The ID string for identify which canvas manager holds this resource.
  */
  public get OwnerID(): string {
    return this.ownerCanvas.ID;
  }

  public get GL() {
    return this.ownerCanvas.GL;
  }

  /**
   * add event handler for changing initialized state changed.
   */
  public onInitializeChanged(handler: Action2<ResourceWrapper, boolean>) {
    this.onInitializeChangedEvent.addListener(handler);
  }

  /**
  * Getter for whether this resource was initialized for this context or not.
  */
  public get Initialized(): boolean {
    return this.initialized;
  }

  public init() {
    return;
  }

  protected setInitialized(initialized?: boolean): void {
    if (typeof initialized === "undefined") { initialized = true; }
    if (initialized === this.initialized) { return; }
    this.initialized = initialized;
    this.onInitializeChangedEvent.fire(this, initialized);
  }

}

export default ResourceWrapper;
