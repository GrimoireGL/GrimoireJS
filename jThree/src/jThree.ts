///<reference path="../_references.ts"/>

module jThree {
    import jThreeObject = jThree.Base.jThreeObject;
    import VectorBase = jThree.Mathematics.Vector.VectorBase;
    import Enumerable = jThree.Collections.IEnumerable;
    import Action1 = jThree.Delegates.Action1;
    import Buffer=jThree.Buffers.Buffer;
    import BufferWrapper = jThree.Buffers.BufferWrapper;
    import Shader = jThree.Effects.Shader;
    import Program = jThree.Effects.Program;
    import Color4 = jThree.Color.Color4;
    import JThreeObjectWithId = jThree.Base.jThreeObjectWithID;
    import Action2 = jThree.Delegates.Action2;
    import Action0 = jThree.Delegates.Action0;

    export class RendererMatriciesManager extends jThreeObject {
        
    }

    export class Timer extends jThreeObject {
        constructor() {
            super();
        }

        protected currentFrame: number=0;
        protected time: number = 0;
        protected timeFromLast: number = 0;

        get CurrentFrame(): number {
            return this.currentFrame;
        }

        get Time(): number {
            return this.time;
        }

        get TimeFromLast(): number {
            return this.timeFromLast;
        }
    }

    class ContextTimer extends Timer {

        updateTimer(): void {
            this.currentFrame++;
            var date:number=Date.now();
            this.TimeFromLast = date - this.Time;
            this.time = date;
        }
    }
    /**
     * コンテキストを跨いでリソースを管理するクラスをまとめているクラス
     */
    export class ResourceManager extends jThreeObject
    {

        constructor() {
            super();
        }

        private get context(): JThreeContext {
            return JThreeContext.Instance;
        }

        private buffers: Map<string, Buffer> = new Map<string, Buffer>();

        createBuffer(id:string,target:BufferTargetType,usage:BufferUsageType,unitCount:number,elementType:ElementType):Buffer {
            if (this.buffers.has(id)) {
                throw new Error("Buffer id cant be dupelicated");
            }
            var buf: Buffer = Buffer.CreateBuffer(this.context.CanvasRenderers, target, usage,unitCount,elementType);
            this.buffers.set(id, buf);
            return buf;
        }

        private shaders: Map<string, Shader> = new Map<string, Shader>();

        createShader(id: string,source:string,shaderType:ShaderType): Shader {
            var shader: Shader = Shader.CreateShader(this.context, source, shaderType);
            this.shaders.set(id, shader);
            return shader;
        }

        private programs: Map<string, Program> = new Map<string, Program>();

        createProgram(id: string,shaders:Shader[]): Program {
            var program: Program = Program.CreateProgram(this.context, shaders);
            this.programs.set(id, program);
            return program;
        }
    } 

    /**
     * jThree context managing all over the pages canvas
     */
    export class JThreeContext extends jThreeObject {
        private static instance: JThreeContext;
        private canvasRenderers: CanvasRenderer[] = [];
        private onRendererChangedFuncs:Action1<Events.RendererListChangedEventArgs>[]=[];
        private resourceManager: ResourceManager;
        private timer: ContextTimer;
        private sceneManager: SceneManager;

        get SceneManager(): SceneManager {
            return this.sceneManager;
        }
        /**
         * Singleton
         */
        public static get Instance(): JThreeContext {
            JThreeContext.instance = JThreeContext.instance || new JThreeContext();
            return JThreeContext.instance;
        }

        constructor() {
            super();
            this.resourceManager = new ResourceManager();
            this.timer = new ContextTimer();
            this.sceneManager = new SceneManager();
        }

        init() {
            this.loop();
        }

        loop(): void {
            JThreeContext.Instance.timer.updateTimer();
            JThreeContext.Instance.sceneManager.renderAll();
            window.setTimeout(JThreeContext.instance.loop, 1000 / 30);
        }

        /**
         * Getter of canvas renderer.
         */
        get CanvasRenderers(): CanvasRenderer[] {
            return this.canvasRenderers;
        }

        get Timer(): Timer {
            return this.timer;
        }

        /**
         * The class managing resources over multiple canvas(Buffer,Shader,Program,Texture)
         */
        get ResourceManager(): ResourceManager {
            return this.resourceManager;
        }

        /**
         * Add renderers to be managed by jThree
         */
        addRenderer(renderer: CanvasRenderer):void {
            if (this.canvasRenderers.indexOf(renderer) === -1) {
                this.canvasRenderers.push(renderer);
                this.notifyRendererChanged(new Events.RendererListChangedEventArgs(Events.RendererStateChangedType.Add, renderer));
            }
        }

        /**
         * Remove renderer
         */
        removeRenderer(renderer: CanvasRenderer): void {
            if (this.canvasRenderers.indexOf(renderer) !== -1) {
                for (var i = 0; i < this.canvasRenderers.length; i++) {
                    if (this.canvasRenderers[i] === renderer)
                    {
                        this.canvasRenderers.splice(i, 1);
                        break;
                    }
                }
                this.notifyRendererChanged(new Events.RendererListChangedEventArgs(Events.RendererStateChangedType.Delete, renderer));
            }
        }

        /**
         * add function as renderer changed event handler.
         */
        onRendererChanged(func:Action1<Events.RendererListChangedEventArgs>): void {
            if (this.onRendererChangedFuncs.indexOf(func) === -1) {
                this.onRendererChangedFuncs.push(func);
            }
        }
        /**
         * notify all event handlers
         */
        protected notifyRendererChanged(arg:Events.RendererListChangedEventArgs): void {
            this.onRendererChangedFuncs.forEach((v, i, a) => v(arg));
        }
    }

    export class RendererBase extends jThreeObject {
        protected context: GLContextWrapperBase;

        get Context(): GLContextWrapperBase
        {
            return this.context;
        }

        protected id: string;

        get ID(): string
        {
            return this.id;
        }

        public enabled: boolean;

        render(drawAct: Action0): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
    }

    export class CanvasRenderer extends RendererBase {
        public static fromCanvas(canvas: HTMLCanvasElement): CanvasRenderer {
            var gl: WebGLRenderingContext;
            try {
                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                var renderer: CanvasRenderer = new CanvasRenderer(gl);
                JThreeContext.Instance.addRenderer(renderer);
                return renderer;
            } catch (e) {
                if (!gl) {
                    //Processing for this error
                }
            }
        }

        private clearColor: Color4;

        get ClearColor(): Color4 {
            return this.clearColor;
        }

        set ClearColor(col: Color4) {
            this.context.ClearColor(col.R, col.G, col.B, col.A);
            this.clearColor = col;
        }

        private glContext: WebGLRenderingContext;

        constructor(glContext?: WebGLRenderingContext) {
            super();
            this.enabled = true;
            this.id = jThree.Base.jThreeID.getUniqueRandom(10);
            this.glContext = glContext;
            this.context = new WebGLWrapper(this.glContext);
            this.ClearColor = new Color4(0,0,255,255);
        }

        render(drawAct:Action0): void {
            if (!this.enabled) return;//enabledじゃないなら描画をスキップ
            this.context.Clear(ClearTargetType.ColorBits);
            drawAct();
            this.context.Finish();
        }
    }

    export class SceneManager extends jThreeObject {
        constructor() {
            super();
        }

        private scenes: Map<string, Scene> = new Map<string, Scene>();
        
        addScene(scene: Scene): void {
            if (!this.scenes.has(scene.ID)) {
                this.scenes.set(scene.ID, scene);
            }
        }

        removeScene(scene: Scene): void {
            if (this.scenes.has(scene.ID)) {
                this.scenes.delete(scene.ID);
            }
        }

        renderAll(): void {
            this.scenes.forEach((v) => {
                v.update();
                v.render();
            });
        }
        
    }

    export class Scene extends jThreeObject {
        constructor() {
            super();
            this.id = jThree.Base.jThreeID.getUniqueRandom(10);
            this.enabled = true;
        }

        private id: string;
        get ID(): string {
            return this.id;
        }

        enabled:boolean;

        update(): void {
            if (!this.enabled) return;//enabled==falseならいらない。
            buf.update(new Float32Array([
                0.0, Math.sin(time / 100), 0.0,
                1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0
            ]), 9);
            time++;
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

        public addObject(targetObject: SceneObject): void {
            //TargetObjectに所属するマテリアルを分割して配列に登録します。
            targetObject.eachMaterial((m) => { this.renderObjects.push(new MaterialObjectPair(m, targetObject)) });
            this.sortObjects();
        }

        private sortObjects(): void {
            this.renderObjects.sort((v1, v2) => { return v1.Material.Priorty - v2.Material.Priorty });
        }
    }

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

    export class Material extends JThreeObjectWithId
    {

        constructor() {
            super();

        }

        private priorty: number;

        get Priorty(): number {
            return this.priorty;
        }

        configureMaterial(renderer:RendererBase,geometry:Geometry): void {
            return;
        }
    }

    export class BasicMaterial extends Material
    {

        protected program:Program;
        constructor() {
            super();
            var jThreeContext: JThreeContext = JThreeContext.Instance;
            var vs = document.getElementById("vs");
            var fs = document.getElementById("fs");
            var vsShader: jThree.Effects.Shader = jThreeContext.ResourceManager.createShader("test-vs", vs.textContent, jThree.ShaderType.VertexShader);
            var fsShader: jThree.Effects.Shader = jThreeContext.ResourceManager.createShader("test-fs", fs.textContent, jThree.ShaderType.FragmentShader);
            vsShader.loadAll();
            fsShader.loadAll();
            this.program= jThreeContext.ResourceManager.createProgram("test-progran", [vsShader, fsShader]);
        }

        configureMaterial(renderer:RendererBase,geometry: Geometry): void {
            this.program.getForRenderer(renderer).setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer));
            renderer.Context.DrawArrays(DrawType.Triangles, 0, 3);
        }
    }


    export class Geometry extends jThreeObject {
        protected positionBuffer: Buffer;
        protected normalBuffer: Buffer;
        protected uvBuffer: Buffer;

        get PositionBuffer(): Buffer {
            return this.positionBuffer;
        }

        get NormalBuffer(): Buffer {
            return this.normalBuffer;
        }

        get UVBuffer(): Buffer {
            return this.uvBuffer;
        }
    }

    export class TriangleGeometry extends Geometry {
        constructor() {
            super();
            this.positionBuffer = JThreeContext.Instance.ResourceManager.createBuffer("triangle-geometry", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
            this.positionBuffer.update(new Float32Array([0.0, 1, 0.0,
                1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0]), 9);
        }
    }


    export class SceneObject extends JThreeObjectWithId
    {
        private materialChanagedHandler:Action2<Material,SceneObject>[]=[];

        private materials: Map<string, Material> = new Map<string, Material>();

        onMaterialChanged(func:Action2<Material,SceneObject>): void {
            this.materialChanagedHandler.push(func);
        }
        /**
         * すべてのマテリアルに対して処理を実行します。
         */
        eachMaterial(func:Action1<Material>): void {
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

    export class Triangle extends SceneObject
    {
        constructor()
        {
            super();
            this.addMaterial(new BasicMaterial());
            this.geometry = new TriangleGeometry();
        }
    }


}

var buf: jThree.Buffers.Buffer;
var time: number = 0;
$(() => {
    var jThreeContext: jThree.JThreeContext = jThree.JThreeContext.Instance;
    var renderer = jThree.CanvasRenderer.fromCanvas(<HTMLCanvasElement>document.getElementById("test-canvas"));
    var renderer2 = jThree.CanvasRenderer.fromCanvas(<HTMLCanvasElement>document.getElementById("test-canvas2"));
    var scene = new jThree.Scene();
    scene.addObject(new jThree.Triangle());
    scene.addRenderer(renderer);
    scene.addRenderer(renderer2);
    jThreeContext.SceneManager.addScene(scene);
    buf = jThreeContext.ResourceManager.createBuffer("test-buffer", jThree.BufferTargetType.ArrayBuffer, jThree.BufferUsageType.DynamicDraw,3,jThree.ElementType.Float);
    jThreeContext.init();
});