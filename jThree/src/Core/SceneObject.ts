import JThreeObject=require('Base/JThreeObject');
import JThreeObjectWithId = require("../Base/JThreeObjectWithID");
import Material = require("./Material");
import Delegates = require("../Delegates");
import Geometry = require("./Geometry");
import RendererBase = require("./RendererBase");
class SceneObject extends JThreeObjectWithId
{
    private materialChanagedHandler:Delegates.Action2<Material,SceneObject>[]=[];

    private materials: Map<string, Material> = new Map<string, Material>();

    onMaterialChanged(func:Delegates.Action2<Material,SceneObject>): void {
        this.materialChanagedHandler.push(func);
    }
    /**
     * すべてのマテリアルに対して処理を実行します。
     */
    eachMaterial(func:Delegates.Action1<Material>): void {
        this.materials.forEach((v) => func(v));
    }

    addMaterial(mat: Material): void
    {
        this.materials.set(mat.ID, mat);
    }

    deleteMaterial(mat: Material): void
    {
        if (this.materials.has(mat.ID)) {
            this.materials.delete(mat.ID);
        }
    }

    protected geometry:Geometry;

    update() {

    }

    render(rendererBase:RendererBase,currentMaterial:Material) {
        currentMaterial.configureMaterial(rendererBase, this.geometry);
    }
}

export=SceneObject;
