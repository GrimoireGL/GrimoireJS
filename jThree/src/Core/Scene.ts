import jThreeObjectWithID = require("../Base/JThreeObjectWithID");
import jThreeId = require("../Base/JThreeID");
import RendererBase = require("./RendererBase");
import Material = require("./Material");
import SceneObject = require("./SceneObject");
/**
* NON PUBLIC CLASS
*/
class MaterialObjectPair {
    constructor(material: Material, targetObject: SceneObject) {
        this.material = material;
        this.targetObject = targetObject;
    }

    private material: Material;
       private targetObject: SceneObject;

    get Material(): Material {
        return this.material;
    }

    get TargetObject(): SceneObject {
        return this.targetObject;
    }

    get ID(): string {
        return this.material.ID + "-" + this.targetObject.ID;
    }
}
class Scene extends jThreeObjectWithID {
    constructor() {
        super();
        this.enabled = true;
    }

    enabled:boolean;

    update(): void {
        if (!this.enabled) return;//enabled==falseならいらない。
        this.targetObjects.forEach(v=>v.update());
    }

    render(): void {
        this.renderers.forEach((r) => {
            r.render(() => {
                this.renderObjects.forEach((v) => v.TargetObject.render(r, v.Material));
            });
        });
    }

    private renderers: RendererBase[] = [];

    public addRenderer(renderer: RendererBase): void {
        this.renderers.push(renderer);
    }

    private renderObjects: MaterialObjectPair[] = [];

    private targetObjects:SceneObject[]=[];

    public addObject(targetObject: SceneObject): void {
        //TargetObjectに所属するマテリアルを分割して配列に登録します。
        this.targetObjects.push(targetObject);
        targetObject.eachMaterial((m) => { this.renderObjects.push(new MaterialObjectPair(m, targetObject)) });
        this.sortObjects();
    }

    private sortObjects(): void {
        this.renderObjects.sort((v1, v2) => { return v1.Material.Priorty - v2.Material.Priorty });
    }
}

export=Scene;
