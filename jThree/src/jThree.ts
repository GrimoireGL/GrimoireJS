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
    import Vector3=jThree.Mathematics.Vector.Vector3;
    import Rectangle = jThree.Mathematics.Rectangle;
    import Matrix = jThree.Mathematics.Matricies.Matrix;

    export class RendererMatriciesManager extends jThreeObject {
        
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

        getBuffer(id:string): Buffer {
            return this.buffers.get(id);
        }

        private shaders: Map<string, Shader> = new Map<string, Shader>();

        createShader(id: string,source:string,shaderType:ShaderType): Shader {
            var shader: Shader = Shader.CreateShader(this.context, source, shaderType);
            this.shaders.set(id, shader);
            return shader;
        }

        getShader(id: string):Shader {
            return this.shaders.get(id);
        }

        private programs: Map<string, Program> = new Map<string, Program>();

        createProgram(id: string,shaders:Shader[]): Program {
            var program: Program = Program.CreateProgram(this.context, shaders);
            this.programs.set(id, program);
            return program;
        }

        getProgram(id: string): Program {
            return this.programs.get(id);
        }
    } 

    /**
     * jThree context managing all over the pages canvas
     */
    export class JThreeContext extends jThreeObject {
        private static instance: JThreeContext;
        private canvasRenderers: CanvasManager[] = [];
        private onRendererChangedFuncs:Action1<Events.RendererListChangedEventArgs>[]=[];
        private resourceManager: ResourceManager;
        private timer: ContextTimer;
        private sceneManager: SceneManager;
        private gomlLoader:GomlLoader;

        get SceneManager(): SceneManager {
            return this.sceneManager;
        }

        get GomlLoader(): GomlLoader {
            return this.gomlLoader;
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
            this.gomlLoader = new GomlLoader();
        }

        /**
         * Begin render loop
         * @returns {} 
         */
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
        get CanvasRenderers(): CanvasManager[] {
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
        addRenderer(renderer: CanvasManager):void {
            if (this.canvasRenderers.indexOf(renderer) === -1) {
                this.canvasRenderers.push(renderer);
                this.notifyRendererChanged(new Events.RendererListChangedEventArgs(Events.RendererStateChangedType.Add, renderer));
            }
        }

        /**
         * Remove renderer
         */
        removeRenderer(renderer: CanvasManager): void {
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

    export class RendererBase extends jThreeObject
    {

        constructor(contextManager:ContextManagerBase) {
            super();
            this.contextManager = contextManager;
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

        protected contextManager: ContextManagerBase;

        get ContextManager(): ContextManagerBase {
            return this.contextManager;
        }

        get Context(): GLContextWrapperBase {
            return this.contextManager.Context;
        }
    }

    export class ContextManagerBase extends JThreeObjectWithId
    {
        constructor() {
            super();
        }
        protected context: GLContextWrapperBase;

        get Context(): GLContextWrapperBase
        {
            return this.context;
        }
    }

    export class ViewPortRenderer extends RendererBase
    {
        constructor(contextManager: ContextManagerBase,viewportArea:Rectangle) {
            super(contextManager);
            this.viewportArea = viewportArea;
            this.backgroundColor = new Color4(0,0.5,1,1);
        }

        private viewportArea: Rectangle;
        private backgroundColor:Color4;

        applyConfigure(): void {
            this.contextManager.Context.ClearColor(this.backgroundColor.R, this.backgroundColor.G, this.backgroundColor.B, this.backgroundColor.A);
            this.contextManager.Context.ViewPort(this.viewportArea.Left, this.viewportArea.Top,this.viewportArea.Width, this.viewportArea.Height);
        }

        render(drawAct: Action0): void {
            this.applyConfigure();
            this.contextManager.Context.Clear(ClearTargetType.ColorBits);
            drawAct();
            this.contextManager.Context.Finish();
        }
    }

    export class CanvasManager extends ContextManagerBase {
        public static fromCanvas(canvas: HTMLCanvasElement): CanvasManager {
            var gl: WebGLRenderingContext;
            try {
                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                var renderer: CanvasManager = new CanvasManager(gl);
                JThreeContext.Instance.addRenderer(renderer);
                return renderer;
            } catch (e) {
                if (!gl) {
                    //Processing for this error
                }
            }
        }

        private glContext: WebGLRenderingContext;

        constructor(glContext: WebGLRenderingContext) {
            super();
           // this.enabled = true;
            this.glContext = glContext;
            this.context = new WebGLWrapper(this.glContext);
        }

        getDefaultViewport(): ViewPortRenderer {
            return new ViewPortRenderer(this,new Rectangle(20,20,280,280));
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
       initial:boolean=false;
       configureMaterial(renderer: RendererBase, geometry: Geometry): void {
           var programWrapper = this.program.getForRenderer(renderer.ContextManager);
           programWrapper.useProgram();
            var vpMat: Matrix;//=Matricies.Matricies.lookAt(new Vector3(0, 0, -1), new Vector3(0, 0, 0), new Vector3(0, 1, 0));
            vpMat = Matrix.identity();//Matricies.Matricies.perspective(Math.PI / 2, 1, 0.1, 10);
           // vpMat = Matricies.Matricies.identity();
            if (!this.initial) {
                console.log(vpMat.toString());
                this.initial = true;
            }
            programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
            programWrapper.setAttributeVerticies("normal",geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
            programWrapper.setUniformMatrix("matMVP", vpMat);
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
            this.positionBuffer.update(new Float32Array([0.0, 1, 0.2,
                1.0, 0.0, 0.2,
                -1.0, 0.0, 0.2]), 9);
            this.normalBuffer = JThreeContext.Instance.ResourceManager.createBuffer("triangle-normals", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
            this.normalBuffer.update(new Float32Array([0,1,-1,1,0,-1,-1,0,-1]),9);
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

    export class GomlLoader extends jThreeObject
    {
        gomlTags: Map<string, GomlTagBase> = new Map<string, GomlTagBase>();

        headTagsById: Map<string, GomlTreeNodeBase> = new Map<string, GomlTreeNodeBase>();

        bodyTagsById:Map<string,GomlTreeNodeBase>=new Map<string,GomlTreeNodeBase>();

        rootObj: JQuery;

        headTags: GomlTreeNodeBase[] = [];

        bodyTags:GomlTreeNodeBase[]=[];

        initForPage(): void {
            this.constructTagDictionary();
            this.rootObj = $("<iframe style='display:none;'/>").appendTo("body").contents();
            var gomls: JQuery = $("script[type='text/goml']");
            gomls.each((index:number, elem:Element) => {
                this.loadScriptTag($(elem));
            });
        }

        private constructTagDictionary(): void {
            this.addGomlTag(new GomlRootTag());
            this.addGomlTag(new GomlHeadTag());
            this.addGomlTag(new GomlBodyTag());
            this.addGomlTag(new GomlRdrTag());
            this.addGomlTag(new GomlVpTag());
        }

        private addGomlTag(tag:GomlTagBase): void {
            this.gomlTags.set(tag.TagName, tag);
        }

        private loadScriptTag(scriptTag: JQuery):void{
            var srcSource: string = scriptTag.attr("src");
            if (srcSource) {//when src is specified
                $.get(srcSource, [], (d) => {
                    this.scriptLoaded(scriptTag[0], d);
                });
            } else {
                this.scriptLoaded(scriptTag[0], scriptTag.text());
            }
        }

        private scriptLoaded(elem: Element, source: string): void {
            source = source.replace(/(head|body)>/g, "j$1>");//TODO Can be bug
            console.log("Replaced:" + source);
            var catched = $(source);
            if (catched[0].tagName !== "GOML") throw new Exceptions.InvalidArgumentException("Root should be goml");
            //console.dir(catched.find("jhead").children());
            //this.rootObj.find("head").append(catched.find("jhead").children());
            //this.rootObj.find("body").append(catched.find("jbody").children());
            var headChild = catched.find("jhead").children();
            var bodyChild = catched.find("jbody").children();
            this.parseHead(headChild,(e) => {
                this.headTags.push(e);
            });
            this.parseBody(bodyChild, (e) => {
                this.bodyTags.push(e);
            });
        }

        private parseHead(child: JQuery, act: Action1<GomlTreeNodeBase>): void {
            if (!child)return;
           console.log(child);
            for (var i = 0; i < child.length; i++) {
                var elem: HTMLElement = child[i];
                if (this.gomlTags.has(elem.tagName)) {
                    var newNode = this.gomlTags.get(elem.tagName).CreateNodeForThis(elem);
                    this.headTagsById.set(newNode.ID, newNode);
                    elem.classList.add("x-j3-"+newNode.ID);
                    act(newNode);
                    this.parseHead($(elem).children(), (e) => { newNode.addChild(e); });
                }
            }
        }

        private parseBody(child: JQuery, act: Action1<GomlTreeNodeBase>):void {
            if (!child) return;
            console.log(child);
            for (var i = 0; i < child.length; i++)
            {
                var elem: HTMLElement = child[i];
                if (this.gomlTags.has(elem.tagName))
                {
                    var newNode = this.gomlTags.get(elem.tagName).CreateNodeForThis(elem);
                    this.bodyTagsById.set(newNode.ID, newNode);
                    elem.classList.add("x-j3-" + newNode.ID);
                    act(newNode);
                    this.parseHead($(elem).children(),(e) => { newNode.addChild(e); });
                }
            }
        }


    }

    export class GomlTagBase extends jThreeObject {
        get TagName(): string {
            return "";
        }

        CreateNodeForThis(elem: Element): GomlTreeNodeBase {
            return null;
        }

        protected getTag(name:string): GomlTagBase {
            return JThreeContext.Instance.GomlLoader.gomlTags.get(name);
        }
    }

    export class GomlRootTag extends GomlTagBase {
        CreateNodeForThis(elem: Element): GomlTreeNodeBase { throw new Error("Not implemented"); }

        get TagName(): string { return "GOML"; }
    }

    export class GomlHeadTag extends GomlTagBase {
        CreateNodeForThis(elem: Element): GomlTreeNodeBase { throw new Error("Not implemented"); }

        get TagName(): string { return "HEAD"; }
 
    }

    export class GomlBodyTag extends GomlTagBase
    {
        CreateNodeForThis(elem: Element): GomlTreeNodeBase { throw new Error("Not implemented"); }

        get TagName(): string { return "BODY"; }

    }

    export class GomlRdrTag extends GomlTagBase {
        CreateNodeForThis(elem: Element): GomlTreeNodeBase {
            return new GomlTreeRdrNode(elem);
        }

        get TagName(): string { return "RDR"; }
    }

    export class GomlVpTag extends GomlTagBase {
        CreateNodeForThis(elem: Element): GomlTreeNodeBase
        {
            return new GomlTreeVpNode(elem);
        }

        get TagName(): string { return "VP"; }
    }

    export class GomlTreeNodeBase extends JThreeObjectWithId
    {
        constructor(elem:Element) {
            super();
            this.element = elem;
        }
        protected element: Element;

        private children: GomlTreeNodeBase[]=[];

        protected parent:GomlTreeNodeBase;

        addChild(child: GomlTreeNodeBase) {
            child.parent = this;
            this.children.push(child);
        }
    }

    export class GomlTreeRdrNode extends GomlTreeNodeBase
    {
        canvasManager:CanvasManager;

        constructor(elem:Element) {
            super(elem);
            var test = $(elem);
            console.log("css test:"+$(test).css("clearcolor"));
            var targetCanvas = $("<canvas></canvas>");
            targetCanvas.addClass("x-j3-c-" + this.ID);
            $(this.Frame).append(targetCanvas);
            this.canvasManager = CanvasManager.fromCanvas(<HTMLCanvasElement>targetCanvas[0]);
            var scene = new jThree.Scene();
            scene.addRenderer(this.canvasManager.getDefaultViewport());
            JThreeContext.Instance.SceneManager.addScene(scene);
        }

        get Frame(): string {
            return this.element.getAttribute("frame")||"body";
        }

    }

    export class GomlTreeVpNode extends GomlTreeNodeBase {
        constructor(elem: Element)
        {
            super(elem);
        }
    }

}

var buf: jThree.Buffers.Buffer;
var time: number = 0;
var noInit: boolean;
$(() => {
    if (noInit)return;
    var jThreeContext: jThree.JThreeContext = jThree.JThreeContext.Instance;
    //var renderer = jThree.CanvasManager.fromCanvas(<HTMLCanvasElement>document.getElementById("test-canvas"));
    //var renderer2 = jThree.CanvasManager.fromCanvas(<HTMLCanvasElement>document.getElementById("test-canvas2"));
    //var scene = new jThree.Scene();
    //scene.addRenderer(renderer.getDefaultViewport());
    //scene.addRenderer(renderer2.getDefaultViewport());
    //scene.addObject(new jThree.Triangle());
    //jThreeContext.SceneManager.addScene(scene);
    //buf = jThreeContext.ResourceManager.createBuffer("test-buffer", jThree.BufferTargetType.ArrayBuffer, jThree.BufferUsageType.DynamicDraw,3,jThree.ElementType.Float);
    jThreeContext.init();
    //GOML テスト
    jThreeContext.GomlLoader.initForPage();
});