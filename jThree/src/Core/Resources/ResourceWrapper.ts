import IDisposable = require("../../Base/IDisposable");
import JThreeObject = require("../../Base/JThreeObject");
import ContextManager = require("../Canvas");
import JThreeEvent = require("../../Base/JThreeEvent");
import Delegates = require("../../Base/Delegates");
class ResourceWrapper extends JThreeObject implements IDisposable {
  constructor(ownerCanvas: ContextManager) {
    super();
    this.ownerCanvas = ownerCanvas;
  }

  private ownerCanvas: ContextManager;


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
   * Whether this resource was initialized for this context or not.
   */
  private initialized: boolean;

  protected onInitializeChangedEvent: JThreeEvent<boolean> = new JThreeEvent<boolean>();

  /**
   * add event handler for changing initialized state changed.
   */
  public onInitializeChanged(handler: Delegates.Action2<ResourceWrapper, boolean>) {
    this.onInitializeChangedEvent.addListener(handler);
  }

  /**
  * Getter for whether this resource was initialized for this context or not.
  */
  public get Initialized(): boolean {
    return this.initialized;
  }

  protected setInitialized(initialized?: boolean): void {
    if (typeof initialized === "undefined") { initialized = true; }
    if (initialized === this.initialized) { return; }
    this.initialized = initialized;
    this.onInitializeChangedEvent.fire(this, initialized);
  }

  public init() {
    return;
  }
}

export = ResourceWrapper;
