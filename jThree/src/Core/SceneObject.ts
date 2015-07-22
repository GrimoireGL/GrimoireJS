import JThreeObject=require('Base/JThreeObject');
import JThreeObjectWithID = require("../Base/JThreeObjectWithID");
import Material = require("./Materials/Material");
import Delegates = require("../Base/Delegates");
import Geometry = require("./Geometries/Geometry");
import Scene=require('./Scene');
import RendererBase = require("./Renderers/RendererBase");
import JThreeCollection = require("../Base/JThreeCollection");
import Transformer = require("./Transform/Transformer");
import AssociativeArray = require('../Base/Collections/AssociativeArray');
/**
 * This is most base class for SceneObject.
 * SceneObject is same as GameObject in Unity.
 */
class SceneObject extends JThreeObjectWithID
{

  constructor(transformer?:Transformer)
  {
    super();
    this.transformer=transformer||new Transformer(this);
  }
    private materialChanagedHandler:Delegates.Action2<Material,SceneObject>[]=[];

    private materials:AssociativeArray<JThreeCollection<Material>>=new AssociativeArray<JThreeCollection<Material>>();

    /**
     * Contains the children.
     */
    private children:JThreeCollection<SceneObject>=new JThreeCollection<SceneObject>();

/**
* Getter for children
*/
    public get Children():JThreeCollection<SceneObject>{
      return this.children;
    }

    public addChild(obj:SceneObject):void
    {
      this.children.insert(obj);
      obj.parent=this;
      obj.Transformer.updateTransform();
    }

    /**
     * Parent of this SceneObject.
     */
    private parent:SceneObject;

    public get Parent():SceneObject
    {
      return this.parent;
    }

    /**
     * Contains the parent scene containing this SceneObject.
     */
    private parentScene:Scene;

     /**
     * The Getter for the parent scene containing this SceneObject.
     */
    public get ParentScene():Scene
    {
        if(!this.parentScene)
        {
            if(!this.parent)
            {
                console.warn("Cant't retrieve the scene contain this SceneObject.This SceneObject is not belonging to any Scene.");
                return null;
            }else{
                this.parentScene=this.parent.ParentScene;//Retrieve and cache parent scene
                return this.parentScene;
            }
        }else{
            //The parent scene was already cached.
            return this.parentScene;
        }
    }

     /**
     * The Getter for the parent scene containing this SceneObject.
     */
    
    public set ParentScene(scene:Scene)
    {
        this.parentScene=scene;
        if(this.parent.ParentScene.ID!=scene.ID)
            console.error("The is something wrong in Scene structure.");
        //insert recursively to the children this SceneObject contains.
        this.children.each((v)=>{
            v.ParentScene=scene;
        });
    }

    onMaterialChanged(func:Delegates.Action2<Material,SceneObject>): void {
        this.materialChanagedHandler.push(func);
    }
    /**
     * すべてのマテリアルに対して処理を実行します。
     */
    eachMaterial(func:Delegates.Action1<Material>): void {
        this.materials.forEach((v) =>v.each(e=>func(e)));
    }

    addMaterial(mat: Material): void
    {
        if(!this.materials.has(mat.MaterialAlias))
        {
            this.materials.set(mat.MaterialAlias,new JThreeCollection<Material>());    
        }        
        this.materials.get(mat.MaterialAlias).insert(mat);
    }
    
    getMaterial(matAlias:string):Material
    {
        if(this.materials.has(matAlias))
        {
            var a=this.materials.get(matAlias);
            var ret=null;
            a.each((e)=>{
                ret=e;
                return;
            });
            return ret;
        }
        return null;
    }


    getMaterials(matAlias:string):Material[]
    {
      if(this.materials.has(matAlias))
      {
        return this.materials.get(matAlias).asArray();
      }
      return [];
    }


    protected geometry:Geometry;

    public get Geometry():Geometry
    {
      return this.geometry;
    }
    
    public set Geometry(geo:Geometry)
    {
        this.geometry=geo;
    }

    protected transformer:Transformer;

    public get Transformer():Transformer
    {
      return this.transformer;
    }

    public callRecursive(action:Delegates.Action1<SceneObject>)
    {
      if(this.children)
      {
      this.children.each(t=> t.callRecursive(action));
      }
      action(this);
    }

    update() {

    }
}

export=SceneObject;
