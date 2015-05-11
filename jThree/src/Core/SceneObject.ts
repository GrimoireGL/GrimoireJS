import JThreeObject=require('Base/JThreeObject');
import JThreeObjectWithId = require("../Base/JThreeObjectWithID");
import Material = require("./Material");
import Delegates = require("../Delegates");
import Geometry = require("./Geometry");
import Scene=require('./Scene');
import RendererBase = require("./RendererBase");
import JThreeCollection = require("../Base/JThreeCollection");
/**
 * This is most base class for SceneObject.
 * SceneObject is same as GameObject in Unity.
 */
class SceneObject extends JThreeObjectWithId
{
    private materialChanagedHandler:Delegates.Action2<Material,SceneObject>[]=[];

    private materials:JThreeCollection<Material>=new JThreeCollection<Material>();

    /**
     * Contains the children.
     */
    private children:JThreeCollection<SceneObject>=new JThreeCollection<SceneObject>();

    public addChild(obj:SceneObject):void
    {
      this.children.insert(obj);
    }

    /**
     * Parent of this SceneObject.
     */
    private parent:SceneObject;

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
        this.materials.each((v) => func(v));
    }

    addMaterial(mat: Material): void
    {
        this.materials.insert(mat);
    }

    deleteMaterial(mat: Material): void
    {
      this.materials.delete(mat);
    }

    protected geometry:Geometry;

    update() {

    }

    render(rendererBase:RendererBase,currentMaterial:Material) {
        currentMaterial.configureMaterial(rendererBase, this.geometry);
    }
}

export=SceneObject;
