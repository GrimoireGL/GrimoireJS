import JThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import RendererBase = require("../Renderers/RendererBase");
import SceneObject = require("../SceneObject");
import Matrix = require("../../Math/Matrix");
import GLCullMode = require("../../Wrapper/GLCullMode");
import GLFeatureType = require("../../Wrapper/GLFeatureType");
class Material extends JThreeObjectWithID
{

    constructor() {
        super();

    }

    private priorty: number;

    get Priorty(): number {
        return this.priorty;
    }

    private cullMode:GLCullMode=GLCullMode.Front;

    get CullMode():GLCullMode
    {
      return this.cullMode;
    }

    private cullEnabled:boolean=true;

    get CullEnabled():boolean
    {
      return this.cullEnabled;
    }

    set CullEnabled(val:boolean)
    {
      this.cullEnabled=val;
    }

    public configureMaterial(renderer:RendererBase,object:SceneObject): void {
      if(this.CullEnabled){
        renderer.GLContext.Enable(
          GLFeatureType.CullFace);
          renderer.GLContext.CullFace(this.cullMode);
        }
        else
        {
          renderer.GLContext.Disable(GLFeatureType.CullFace);
        }
        return;
    }

    public draw(renderer:RendererBase,object:SceneObject):void
    {
      if(!object.Geometry)return;
      var geometry=object.Geometry;
      this.configureMaterial(renderer,object);
      renderer.GLContext.DrawElements(geometry.PrimitiveTopology, geometry.IndexBuffer.Length,geometry.IndexBuffer.ElementType,0);
    }

/**
* Calculate MVP(Model-View-Projection) matrix
*/
    protected CalculateMVPMatrix(renderer:RendererBase,object:SceneObject):Matrix
    {
      return Matrix.multiply(Matrix.multiply(renderer.Camera.ProjectionMatrix,renderer.Camera.ViewMatrix),object.Transformer.LocalToGlobal);
    }
}

export=Material;
