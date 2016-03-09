import TextureBase from "../../Resources/Texture/TextureBase";
import RSMLRenderStageBase from "./RSML/RSMLRenderStage";
import Q from "q";
class HitAreaRenderStage extends RSMLRenderStageBase {
    constructor(renderer) {
        super(renderer, require("./BuiltIn/HitAreaRenderingStage.html"));
        /**
         * Object index for rendering hit area.
         * (This is internal use)
         * @type {number}
         */
        this.objectIndex = 1;
        this.indexObjectPair = {};
        this.hitTestQueries = [];
        this.Renderer.on("mouse-move", (e) => {
            this.queryHitTest(e.mouseX, e.mouseY).then((object) => {
                console.log(object);
            });
        });
    }
    preTechnique(scene, techniqueIndex, texs) {
        super.preTechnique(scene, techniqueIndex, texs);
        this.objectIndex = 1;
    }
    render(scene, object, techniqueCount, techniqueIndex, texs) {
        this.indexObjectPair[this.objectIndex] = object;
        super.render(scene, object, techniqueCount, techniqueIndex, texs);
        this.objectIndex++;
    }
    postTechnique(scene, techniqueIndex, texs) {
        if (texs["OUT"]) {
            if (!(texs["OUT"] instanceof TextureBase)) {
                throw new Error("OUT argument cannnot acceptable except TextureBase");
            }
            const canvas = this.Renderer.Canvas;
            for (let i = 0; i < this.hitTestQueries.length; i++) {
                const query = this.hitTestQueries[i];
                const fetchedPixel = texs["OUT"].getForContext(canvas).getPixel(query.x, this.Renderer.region.Height - query.y);
                const object = this._fetchRelatedObject(fetchedPixel);
                query.deferred.resolve(object);
            }
            this.hitTestQueries.splice(0);
        }
    }
    queryHitTest(x, y) {
        const deferred = Q.defer();
        this.hitTestQueries.push({
            x: x,
            y: y,
            deferred: deferred
        });
        return deferred.promise;
    }
    _fetchRelatedObject(pixel) {
        const id = (pixel[0] << 16) | pixel[1];
        return this.indexObjectPair[id];
    }
}
export default HitAreaRenderStage;
