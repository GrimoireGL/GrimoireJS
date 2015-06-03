import GLContextWrapperBase = require("../../Wrapper/GLContextWrapperBase");
import JThreeObject = require('../../Base/JThreeObject');
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import ContextManager = require('../ContextManagerBase');
class ResourceWrapper extends JThreeObject
{
  constructor(ownerCanvas:ContextManager)
  {
    super();
    this.ownerCanvas=ownerCanvas;
  }

  private ownerCanvas:ContextManager;

  /**
  * The canvas hold this resource.
  */
  public get OwnerCanvas():ContextManager
  {
    return this.ownerCanvas;
  }

  /**
  * The ID string for identify which canvas manager holds this resource.
  */
  public get OwnerID():string
  {
    return this.ownerCanvas.ID;
  }

  protected get WebGLContext():GLContextWrapperBase
  {
    return this.ownerCanvas.Context;
  }
}

export = ResourceWrapper;
