import JThreeObjectWithID = require("../Base/JThreeObjectWithID");
import Material = require("./Materials/Material");
import Delegates = require("../Base/Delegates");
import Geometry = require("./Geometries/Geometry");
import Scene=require('./Scene');
import JThreeCollection = require("../Base/JThreeCollection");
import Transformer = require("./Transform/Transformer");
import AssociativeArray = require('../Base/Collections/AssociativeArray');
import JThreeEvent = require("../Base/JThreeEvent");
import ISceneObjectStructureChangedEventArgs = require("./ISceneObjectChangedEventArgs");
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
    this.name = this.ID;
  }

    private onStructureChangedEvent:JThreeEvent<ISceneObjectStructureChangedEventArgs> = new JThreeEvent<ISceneObjectStructureChangedEventArgs>();

    public name:string;

    private materialChanagedHandler:Delegates.Action2<Material,SceneObject>[]=[];

    private materials:AssociativeArray<JThreeCollection<Material>>=new AssociativeArray<JThreeCollection<Material>>();

    /**
     * Contains the children.
     */
    private children:SceneObject[] =[];

    /**
    * Getter for children
    */
    public get Children():SceneObject[]{
      return this.children;
    }

    public addChild(obj:SceneObject):void
    {
      this.children.push(obj);
      obj.parent=this;
      obj.Transformer.updateTransform();
      var eventArg = {
        owner:this,
        scene:this.ParentScene,
        isAdditionalChange:true,
        changedSceneObject:obj,
        changedSceneObjectID:obj.ID
      };
      this.onStructureChangedEvent.fire(this,eventArg);
      this.onChildrenChanged();
      obj.onParentChanged();
      if(this.ParentScene)this.ParentScene.notifySceneObjectChanged(eventArg);
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
                return null;
            }else{
                this.ParentScene=this.parent.ParentScene;//Retrieve and cache parent scene
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
        // if(!this.parent||this.parent.ParentScene.ID!=scene.ID)
        //     console.error("There is something wrong in Scene structure.");
        //insert recursively to the children this SceneObject contains.
        this.children.forEach((v)=>{
            v.ParentScene=scene;
        });
        this.onParentSceneChanged();
    }

    public onMaterialChanged(func:Delegates.Action2<Material,SceneObject>): void {
        this.materialChanagedHandler.push(func);
    }
    /**
     * すべてのマテリアルに対して処理を実行します。
     */
    public eachMaterial(func:Delegates.Action1<Material>): void {
        this.materials.forEach((v) =>v.each(e=>func(e)));
    }

    public addMaterial(mat: Material): void
    {
        if(!this.materials.has(mat.MaterialGroup))
        {
            this.materials.set(mat.MaterialGroup,new JThreeCollection<Material>());
        }
        this.materials.get(mat.MaterialGroup).insert(mat);
    }

    public getMaterial(matGroup:string):Material
    {
        if(this.materials.has(matGroup))
        {
            var a=this.materials.get(matGroup);
            var ret=null;
            a.each((e)=>{
                ret=e;
                return;
            });
            return ret;
        }
        return null;
    }

    public getMaterials(matAlias:string):Material[]
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
      this.children.forEach(t=> t.callRecursive(action));
      }
      action(this);
    }

    public onChildrenChanged()
    {

    }

    public onParentChanged()
    {

    }

    public onParentSceneChanged()
    {

    }

    public update() {

    }
}

export=SceneObject;
