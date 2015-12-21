import GomlTreeNodeBase = require("../../Goml/GomlTreeNodeBase");
import SceneObjectNodeBase = require("./../../Goml/Nodes/SceneObjects/SceneObjectNodeBase");
import SceneNode = require("../../Goml/Nodes/SceneNode");
import SceneObject = require("../../Core/SceneObject");
import PMXModel = require('../Core/PMXModel');
import JThreeEvent = require('../../Base/JThreeEvent');
import Delegates = require('../../Base/Delegates');
import JThreeContext = require("../../JThreeContext");
import ContextComponents = require("../../ContextComponents");
import ResourceLoader = require("../../Core/ResourceLoader");
import Q = require("q");

class PMXNode extends SceneObjectNodeBase {
  private pmxModel: PMXModel = null;

  public get PMXModel() {
    return this.pmxModel;
  }

  public get PMXModelReady() {
    return this.PMXModel != null;
  }

  private pmxLoadingDeferred: Q.Deferred<void>;

  constructor() {
    super();
    this.pmxLoadingDeferred = JThreeContext.getContextComponent<ResourceLoader>(ContextComponents.ResourceLoader).getResourceLoadingDeffered();
    this.attributes.defineAttribute({
      "src": {
        converter: "string",
        value: "",
      }
    })
  }

  protected ConstructTarget(callbackfn): void {
    this.on('loaded', () => {
      callbackfn(this.pmxModel);
    })
  }

  public nodeWillMount(parent) {
    super.nodeWillMount(parent);
    PMXModel.LoadFromUrl(this.attributes.getValue("src"))
      .then((m) => {
        this.pmxModel = m;
        this.targetUpdated();
        this.emit('loaded', m);
        // this.pmxTargetUpdated.fire(this, m);
        // this.bubbleEvent("loaded",{target:this});
        this.pmxLoadingDeferred.resolve(null);
      });
  }

  protected targetUpdated() {
    super.nodeDidMounted();
  }

}

export =PMXNode;
