/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		///<reference path="../_references.ts"/>
		var __extends = this.__extends || function (d, b) {
		    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		    function __() { this.constructor = d; }
		    __.prototype = b.prototype;
		    d.prototype = new __();
		};
		var jThree;
		(function (jThree) {
		    var jThreeObject = jThree.Base.jThreeObject;
		    var Buffer = jThree.Buffers.Buffer;
		    var Shader = jThree.Effects.Shader;
		    var Program = jThree.Effects.Program;
		    var Color4 = jThree.Color.Color4;
		    var JThreeObjectWithId = jThree.Base.jThreeObjectWithID;
		    var Rectangle = jThree.Mathematics.Rectangle;
		    var Matrix = jThree.Mathematics.Matricies.Matrix;
		    var RendererMatriciesManager = (function (_super) {
		        __extends(RendererMatriciesManager, _super);
		        function RendererMatriciesManager() {
		            _super.apply(this, arguments);
		        }
		        return RendererMatriciesManager;
		    })(jThreeObject);
		    jThree.RendererMatriciesManager = RendererMatriciesManager;
		    /**
		     * コンテキストを跨いでリソースを管理するクラスをまとめているクラス
		     */
		    var ResourceManager = (function (_super) {
		        __extends(ResourceManager, _super);
		        function ResourceManager() {
		            _super.call(this);
		            this.buffers = new Map();
		            this.shaders = new Map();
		            this.programs = new Map();
		        }
		        Object.defineProperty(ResourceManager.prototype, "context", {
		            get: function () {
		                return JThreeContext.Instance;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        ResourceManager.prototype.createBuffer = function (id, target, usage, unitCount, elementType) {
		            if (this.buffers.has(id)) {
		                throw new Error("Buffer id cant be dupelicated");
		            }
		            var buf = Buffer.CreateBuffer(this.context.CanvasRenderers, target, usage, unitCount, elementType);
		            this.buffers.set(id, buf);
		            return buf;
		        };
		        ResourceManager.prototype.getBuffer = function (id) {
		            return this.buffers.get(id);
		        };
		        ResourceManager.prototype.createShader = function (id, source, shaderType) {
		            var shader = Shader.CreateShader(this.context, source, shaderType);
		            this.shaders.set(id, shader);
		            return shader;
		        };
		        ResourceManager.prototype.getShader = function (id) {
		            return this.shaders.get(id);
		        };
		        ResourceManager.prototype.createProgram = function (id, shaders) {
		            var program = Program.CreateProgram(this.context, shaders);
		            this.programs.set(id, program);
		            return program;
		        };
		        ResourceManager.prototype.getProgram = function (id) {
		            return this.programs.get(id);
		        };
		        return ResourceManager;
		    })(jThreeObject);
		    jThree.ResourceManager = ResourceManager;
		    /**
		     * jThree context managing all over the pages canvas
		     */
		    var JThreeContext = (function (_super) {
		        __extends(JThreeContext, _super);
		        function JThreeContext() {
		            _super.call(this);
		            this.canvasRenderers = [];
		            this.onRendererChangedFuncs = [];
		            this.resourceManager = new ResourceManager();
		            this.timer = new jThree.ContextTimer();
		            this.sceneManager = new SceneManager();
		            this.gomlLoader = new GomlLoader();
		        }
		        Object.defineProperty(JThreeContext.prototype, "SceneManager", {
		            get: function () {
		                return this.sceneManager;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Object.defineProperty(JThreeContext.prototype, "GomlLoader", {
		            get: function () {
		                return this.gomlLoader;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Object.defineProperty(JThreeContext, "Instance", {
		            /**
		             * Singleton
		             */
		            get: function () {
		                JThreeContext.instance = JThreeContext.instance || new JThreeContext();
		                return JThreeContext.instance;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        /**
		         * Begin render loop
		         * @returns {}
		         */
		        JThreeContext.prototype.init = function () {
		            this.loop();
		        };
		        JThreeContext.prototype.loop = function () {
		            JThreeContext.Instance.timer.updateTimer();
		            JThreeContext.Instance.sceneManager.renderAll();
		            window.setTimeout(JThreeContext.instance.loop, 1000 / 30);
		        };
		        Object.defineProperty(JThreeContext.prototype, "CanvasRenderers", {
		            /**
		             * Getter of canvas renderer.
		             */
		            get: function () {
		                return this.canvasRenderers;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Object.defineProperty(JThreeContext.prototype, "Timer", {
		            get: function () {
		                return this.timer;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Object.defineProperty(JThreeContext.prototype, "ResourceManager", {
		            /**
		             * The class managing resources over multiple canvas(Buffer,Shader,Program,Texture)
		             */
		            get: function () {
		                return this.resourceManager;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        /**
		         * Add renderers to be managed by jThree
		         */
		        JThreeContext.prototype.addRenderer = function (renderer) {
		            if (this.canvasRenderers.indexOf(renderer) === -1) {
		                this.canvasRenderers.push(renderer);
		                this.notifyRendererChanged(new jThree.Events.RendererListChangedEventArgs(jThree.Events.RendererStateChangedType.Add, renderer));
		            }
		        };
		        /**
		         * Remove renderer
		         */
		        JThreeContext.prototype.removeRenderer = function (renderer) {
		            if (this.canvasRenderers.indexOf(renderer) !== -1) {
		                for (var i = 0; i < this.canvasRenderers.length; i++) {
		                    if (this.canvasRenderers[i] === renderer) {
		                        this.canvasRenderers.splice(i, 1);
		                        break;
		                    }
		                }
		                this.notifyRendererChanged(new jThree.Events.RendererListChangedEventArgs(jThree.Events.RendererStateChangedType.Delete, renderer));
		            }
		        };
		        /**
		         * add function as renderer changed event handler.
		         */
		        JThreeContext.prototype.onRendererChanged = function (func) {
		            if (this.onRendererChangedFuncs.indexOf(func) === -1) {
		                this.onRendererChangedFuncs.push(func);
		            }
		        };
		        /**
		         * notify all event handlers
		         */
		        JThreeContext.prototype.notifyRendererChanged = function (arg) {
		            this.onRendererChangedFuncs.forEach(function (v, i, a) { return v(arg); });
		        };
		        return JThreeContext;
		    })(jThreeObject);
		    jThree.JThreeContext = JThreeContext;
		    var RendererBase = (function (_super) {
		        __extends(RendererBase, _super);
		        function RendererBase(contextManager) {
		            _super.call(this);
		            this.contextManager = contextManager;
		        }
		        Object.defineProperty(RendererBase.prototype, "ID", {
		            get: function () {
		                return this.id;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        RendererBase.prototype.render = function (drawAct) {
		            throw new jThree.Exceptions.AbstractClassMethodCalledException();
		        };
		        Object.defineProperty(RendererBase.prototype, "ContextManager", {
		            get: function () {
		                return this.contextManager;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Object.defineProperty(RendererBase.prototype, "Context", {
		            get: function () {
		                return this.contextManager.Context;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        return RendererBase;
		    })(jThreeObject);
		    jThree.RendererBase = RendererBase;
		    var ContextManagerBase = (function (_super) {
		        __extends(ContextManagerBase, _super);
		        function ContextManagerBase() {
		            _super.call(this);
		        }
		        Object.defineProperty(ContextManagerBase.prototype, "Context", {
		            get: function () {
		                return this.context;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        return ContextManagerBase;
		    })(JThreeObjectWithId);
		    jThree.ContextManagerBase = ContextManagerBase;
		    var ViewPortRenderer = (function (_super) {
		        __extends(ViewPortRenderer, _super);
		        function ViewPortRenderer(contextManager, viewportArea) {
		            _super.call(this, contextManager);
		            this.viewportArea = viewportArea;
		            this.backgroundColor = new Color4(0, 0.5, 1, 1);
		        }
		        ViewPortRenderer.prototype.applyConfigure = function () {
		            this.contextManager.Context.ClearColor(this.backgroundColor.R, this.backgroundColor.G, this.backgroundColor.B, this.backgroundColor.A);
		            this.contextManager.Context.ViewPort(this.viewportArea.Left, this.viewportArea.Top, this.viewportArea.Width, this.viewportArea.Height);
		        };
		        ViewPortRenderer.prototype.render = function (drawAct) {
		            this.applyConfigure();
		            this.contextManager.Context.Clear(jThree.ClearTargetType.ColorBits);
		            drawAct();
		            this.contextManager.Context.Finish();
		        };
		        return ViewPortRenderer;
		    })(RendererBase);
		    jThree.ViewPortRenderer = ViewPortRenderer;
		    var CanvasManager = (function (_super) {
		        __extends(CanvasManager, _super);
		        function CanvasManager(glContext) {
		            _super.call(this);
		            // this.enabled = true;
		            this.glContext = glContext;
		            this.context = new jThree.WebGLWrapper(this.glContext);
		        }
		        CanvasManager.fromCanvas = function (canvas) {
		            var gl;
		            try {
		                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		                var renderer = new CanvasManager(gl);
		                JThreeContext.Instance.addRenderer(renderer);
		                return renderer;
		            }
		            catch (e) {
		                if (!gl) {
		                }
		            }
		        };
		        CanvasManager.prototype.getDefaultViewport = function () {
		            return new ViewPortRenderer(this, new Rectangle(20, 20, 280, 280));
		        };
		        return CanvasManager;
		    })(ContextManagerBase);
		    jThree.CanvasManager = CanvasManager;
		    var SceneManager = (function (_super) {
		        __extends(SceneManager, _super);
		        function SceneManager() {
		            _super.call(this);
		            this.scenes = new Map();
		        }
		        SceneManager.prototype.addScene = function (scene) {
		            if (!this.scenes.has(scene.ID)) {
		                this.scenes.set(scene.ID, scene);
		            }
		        };
		        SceneManager.prototype.removeScene = function (scene) {
		            if (this.scenes.has(scene.ID)) {
		                this.scenes.delete(scene.ID);
		            }
		        };
		        SceneManager.prototype.renderAll = function () {
		            this.scenes.forEach(function (v) {
		                v.update();
		                v.render();
		            });
		        };
		        return SceneManager;
		    })(jThreeObject);
		    jThree.SceneManager = SceneManager;
		    var Scene = (function (_super) {
		        __extends(Scene, _super);
		        function Scene() {
		            _super.call(this);
		            this.renderers = [];
		            this.renderObjects = [];
		            this.id = jThree.Base.jThreeID.getUniqueRandom(10);
		            this.enabled = true;
		        }
		        Object.defineProperty(Scene.prototype, "ID", {
		            get: function () {
		                return this.id;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Scene.prototype.update = function () {
		            if (!this.enabled)
		                return; //enabled==falseならいらない。
		            time++;
		        };
		        Scene.prototype.render = function () {
		            var _this = this;
		            this.renderers.forEach(function (r) {
		                r.render(function () {
		                    _this.renderObjects.forEach(function (v) { return v.TargetObject.render(r, v.Material); });
		                });
		            });
		        };
		        Scene.prototype.addRenderer = function (renderer) {
		            this.renderers.push(renderer);
		        };
		        Scene.prototype.addObject = function (targetObject) {
		            var _this = this;
		            //TargetObjectに所属するマテリアルを分割して配列に登録します。
		            targetObject.eachMaterial(function (m) {
		                _this.renderObjects.push(new MaterialObjectPair(m, targetObject));
		            });
		            this.sortObjects();
		        };
		        Scene.prototype.sortObjects = function () {
		            this.renderObjects.sort(function (v1, v2) {
		                return v1.Material.Priorty - v2.Material.Priorty;
		            });
		        };
		        return Scene;
		    })(jThreeObject);
		    jThree.Scene = Scene;
		    var MaterialObjectPair = (function () {
		        function MaterialObjectPair(material, targetObject) {
		            this.material = material;
		            this.targetObject = targetObject;
		        }
		        Object.defineProperty(MaterialObjectPair.prototype, "Material", {
		            get: function () {
		                return this.material;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Object.defineProperty(MaterialObjectPair.prototype, "TargetObject", {
		            get: function () {
		                return this.targetObject;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Object.defineProperty(MaterialObjectPair.prototype, "ID", {
		            get: function () {
		                return this.material.ID + "-" + this.targetObject.ID;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        return MaterialObjectPair;
		    })();
		    var Material = (function (_super) {
		        __extends(Material, _super);
		        function Material() {
		            _super.call(this);
		        }
		        Object.defineProperty(Material.prototype, "Priorty", {
		            get: function () {
		                return this.priorty;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Material.prototype.configureMaterial = function (renderer, geometry) {
		            return;
		        };
		        return Material;
		    })(JThreeObjectWithId);
		    jThree.Material = Material;
		    var BasicMaterial = (function (_super) {
		        __extends(BasicMaterial, _super);
		        function BasicMaterial() {
		            _super.call(this);
		            this.initial = false;
		            var jThreeContext = JThreeContext.Instance;
		            var vs = document.getElementById("vs");
		            var fs = document.getElementById("fs");
		            var vsShader = jThreeContext.ResourceManager.createShader("test-vs", vs.textContent, jThree.ShaderType.VertexShader);
		            var fsShader = jThreeContext.ResourceManager.createShader("test-fs", fs.textContent, jThree.ShaderType.FragmentShader);
		            vsShader.loadAll();
		            fsShader.loadAll();
		            this.program = jThreeContext.ResourceManager.createProgram("test-progran", [vsShader, fsShader]);
		        }
		        BasicMaterial.prototype.configureMaterial = function (renderer, geometry) {
		            var programWrapper = this.program.getForRenderer(renderer.ContextManager);
		            programWrapper.useProgram();
		            var vpMat; //=Matricies.Matricies.lookAt(new Vector3(0, 0, -1), new Vector3(0, 0, 0), new Vector3(0, 1, 0));
		            vpMat = Matrix.identity(); //Matricies.Matricies.perspective(Math.PI / 2, 1, 0.1, 10);
		            // vpMat = Matricies.Matricies.identity();
		            if (!this.initial) {
		                console.log(vpMat.toString());
		                this.initial = true;
		            }
		            programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
		            programWrapper.setAttributeVerticies("normal", geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
		            programWrapper.setUniformMatrix("matMVP", vpMat);
		            renderer.Context.DrawArrays(jThree.DrawType.Triangles, 0, 3);
		        };
		        return BasicMaterial;
		    })(Material);
		    jThree.BasicMaterial = BasicMaterial;
		    var Geometry = (function (_super) {
		        __extends(Geometry, _super);
		        function Geometry() {
		            _super.apply(this, arguments);
		        }
		        Object.defineProperty(Geometry.prototype, "PositionBuffer", {
		            get: function () {
		                return this.positionBuffer;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Object.defineProperty(Geometry.prototype, "NormalBuffer", {
		            get: function () {
		                return this.normalBuffer;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        Object.defineProperty(Geometry.prototype, "UVBuffer", {
		            get: function () {
		                return this.uvBuffer;
		            },
		            enumerable: true,
		            configurable: true
		        });
		        return Geometry;
		    })(jThreeObject);
		    jThree.Geometry = Geometry;
		    var TriangleGeometry = (function (_super) {
		        __extends(TriangleGeometry, _super);
		        function TriangleGeometry() {
		            _super.call(this);
		            this.positionBuffer = JThreeContext.Instance.ResourceManager.createBuffer("triangle-geometry", jThree.BufferTargetType.ArrayBuffer, jThree.BufferUsageType.StaticDraw, 3, jThree.ElementType.Float);
		            this.positionBuffer.update(new Float32Array([0.0, 1, 0.2, 1.0, 0.0, 0.2, -1.0, 0.0, 0.2]), 9);
		            this.normalBuffer = JThreeContext.Instance.ResourceManager.createBuffer("triangle-normals", jThree.BufferTargetType.ArrayBuffer, jThree.BufferUsageType.StaticDraw, 3, jThree.ElementType.Float);
		            this.normalBuffer.update(new Float32Array([0, 1, -1, 1, 0, -1, -1, 0, -1]), 9);
		        }
		        return TriangleGeometry;
		    })(Geometry);
		    jThree.TriangleGeometry = TriangleGeometry;
		    var SceneObject = (function (_super) {
		        __extends(SceneObject, _super);
		        function SceneObject() {
		            _super.apply(this, arguments);
		            this.materialChanagedHandler = [];
		            this.materials = new Map();
		        }
		        SceneObject.prototype.onMaterialChanged = function (func) {
		            this.materialChanagedHandler.push(func);
		        };
		        /**
		         * すべてのマテリアルに対して処理を実行します。
		         */
		        SceneObject.prototype.eachMaterial = function (func) {
		            this.materials.forEach(function (v) { return func(v); });
		        };
		        SceneObject.prototype.addMaterial = function (mat) {
		            this.materials.set(mat.ID, mat);
		        };
		        SceneObject.prototype.deleteMaterial = function (mat) {
		            if (this.materials.has(mat.ID)) {
		                this.materials.delete(mat.ID);
		            }
		        };
		        SceneObject.prototype.update = function () {
		        };
		        SceneObject.prototype.render = function (rendererBase, currentMaterial) {
		            currentMaterial.configureMaterial(rendererBase, this.geometry);
		        };
		        return SceneObject;
		    })(JThreeObjectWithId);
		    jThree.SceneObject = SceneObject;
		    var Triangle = (function (_super) {
		        __extends(Triangle, _super);
		        function Triangle() {
		            _super.call(this);
		            this.addMaterial(new BasicMaterial());
		            this.geometry = new TriangleGeometry();
		        }
		        return Triangle;
		    })(SceneObject);
		    jThree.Triangle = Triangle;
		    var GomlLoader = (function (_super) {
		        __extends(GomlLoader, _super);
		        function GomlLoader() {
		            _super.apply(this, arguments);
		            this.gomlTags = new Map();
		            this.headTagsById = new Map();
		            this.bodyTagsById = new Map();
		            this.headTags = [];
		            this.bodyTags = [];
		        }
		        GomlLoader.prototype.initForPage = function () {
		            var _this = this;
		            this.constructTagDictionary();
		            this.rootObj = $("<iframe style='display:none;'/>").appendTo("body").contents();
		            var gomls = $("script[type='text/goml']");
		            gomls.each(function (index, elem) {
		                _this.loadScriptTag($(elem));
		            });
		        };
		        GomlLoader.prototype.constructTagDictionary = function () {
		            this.addGomlTag(new GomlRootTag());
		            this.addGomlTag(new GomlHeadTag());
		            this.addGomlTag(new GomlBodyTag());
		            this.addGomlTag(new GomlRdrTag());
		            this.addGomlTag(new GomlVpTag());
		        };
		        GomlLoader.prototype.addGomlTag = function (tag) {
		            this.gomlTags.set(tag.TagName, tag);
		        };
		        GomlLoader.prototype.loadScriptTag = function (scriptTag) {
		            var _this = this;
		            var srcSource = scriptTag.attr("src");
		            if (srcSource) {
		                $.get(srcSource, [], function (d) {
		                    _this.scriptLoaded(scriptTag[0], d);
		                });
		            }
		            else {
		                this.scriptLoaded(scriptTag[0], scriptTag.text());
		            }
		        };
		        GomlLoader.prototype.scriptLoaded = function (elem, source) {
		            var _this = this;
		            source = source.replace(/(head|body)>/g, "j$1>"); //TODO Can be bug
		            console.log("Replaced:" + source);
		            var catched = $(source);
		            if (catched[0].tagName !== "GOML")
		                throw new jThree.Exceptions.InvalidArgumentException("Root should be goml");
		            //console.dir(catched.find("jhead").children());
		            //this.rootObj.find("head").append(catched.find("jhead").children());
		            //this.rootObj.find("body").append(catched.find("jbody").children());
		            var headChild = catched.find("jhead").children();
		            var bodyChild = catched.find("jbody").children();
		            this.parseHead(headChild, function (e) {
		                _this.headTags.push(e);
		            });
		            this.parseBody(bodyChild, function (e) {
		                _this.bodyTags.push(e);
		            });
		        };
		        GomlLoader.prototype.parseHead = function (child, act) {
		            if (!child)
		                return;
		            console.log(child);
		            for (var i = 0; i < child.length; i++) {
		                var elem = child[i];
		                if (this.gomlTags.has(elem.tagName)) {
		                    var newNode = this.gomlTags.get(elem.tagName).CreateNodeForThis(elem);
		                    this.headTagsById.set(newNode.ID, newNode);
		                    elem.classList.add("x-j3-" + newNode.ID);
		                    act(newNode);
		                    this.parseHead($(elem).children(), function (e) {
		                        newNode.addChild(e);
		                    });
		                }
		            }
		        };
		        GomlLoader.prototype.parseBody = function (child, act) {
		            if (!child)
		                return;
		            console.log(child);
		            for (var i = 0; i < child.length; i++) {
		                var elem = child[i];
		                if (this.gomlTags.has(elem.tagName)) {
		                    var newNode = this.gomlTags.get(elem.tagName).CreateNodeForThis(elem);
		                    this.bodyTagsById.set(newNode.ID, newNode);
		                    elem.classList.add("x-j3-" + newNode.ID);
		                    act(newNode);
		                    this.parseHead($(elem).children(), function (e) {
		                        newNode.addChild(e);
		                    });
		                }
		            }
		        };
		        return GomlLoader;
		    })(jThreeObject);
		    jThree.GomlLoader = GomlLoader;
		    var GomlTagBase = (function (_super) {
		        __extends(GomlTagBase, _super);
		        function GomlTagBase() {
		            _super.apply(this, arguments);
		        }
		        Object.defineProperty(GomlTagBase.prototype, "TagName", {
		            get: function () {
		                return "";
		            },
		            enumerable: true,
		            configurable: true
		        });
		        GomlTagBase.prototype.CreateNodeForThis = function (elem) {
		            return null;
		        };
		        GomlTagBase.prototype.getTag = function (name) {
		            return JThreeContext.Instance.GomlLoader.gomlTags.get(name);
		        };
		        return GomlTagBase;
		    })(jThreeObject);
		    jThree.GomlTagBase = GomlTagBase;
		    var GomlRootTag = (function (_super) {
		        __extends(GomlRootTag, _super);
		        function GomlRootTag() {
		            _super.apply(this, arguments);
		        }
		        GomlRootTag.prototype.CreateNodeForThis = function (elem) {
		            throw new Error("Not implemented");
		        };
		        Object.defineProperty(GomlRootTag.prototype, "TagName", {
		            get: function () {
		                return "GOML";
		            },
		            enumerable: true,
		            configurable: true
		        });
		        return GomlRootTag;
		    })(GomlTagBase);
		    jThree.GomlRootTag = GomlRootTag;
		    var GomlHeadTag = (function (_super) {
		        __extends(GomlHeadTag, _super);
		        function GomlHeadTag() {
		            _super.apply(this, arguments);
		        }
		        GomlHeadTag.prototype.CreateNodeForThis = function (elem) {
		            throw new Error("Not implemented");
		        };
		        Object.defineProperty(GomlHeadTag.prototype, "TagName", {
		            get: function () {
		                return "HEAD";
		            },
		            enumerable: true,
		            configurable: true
		        });
		        return GomlHeadTag;
		    })(GomlTagBase);
		    jThree.GomlHeadTag = GomlHeadTag;
		    var GomlBodyTag = (function (_super) {
		        __extends(GomlBodyTag, _super);
		        function GomlBodyTag() {
		            _super.apply(this, arguments);
		        }
		        GomlBodyTag.prototype.CreateNodeForThis = function (elem) {
		            throw new Error("Not implemented");
		        };
		        Object.defineProperty(GomlBodyTag.prototype, "TagName", {
		            get: function () {
		                return "BODY";
		            },
		            enumerable: true,
		            configurable: true
		        });
		        return GomlBodyTag;
		    })(GomlTagBase);
		    jThree.GomlBodyTag = GomlBodyTag;
		    var GomlRdrTag = (function (_super) {
		        __extends(GomlRdrTag, _super);
		        function GomlRdrTag() {
		            _super.apply(this, arguments);
		        }
		        GomlRdrTag.prototype.CreateNodeForThis = function (elem) {
		            return new GomlTreeRdrNode(elem);
		        };
		        Object.defineProperty(GomlRdrTag.prototype, "TagName", {
		            get: function () {
		                return "RDR";
		            },
		            enumerable: true,
		            configurable: true
		        });
		        return GomlRdrTag;
		    })(GomlTagBase);
		    jThree.GomlRdrTag = GomlRdrTag;
		    var GomlVpTag = (function (_super) {
		        __extends(GomlVpTag, _super);
		        function GomlVpTag() {
		            _super.apply(this, arguments);
		        }
		        GomlVpTag.prototype.CreateNodeForThis = function (elem) {
		            return new GomlTreeVpNode(elem);
		        };
		        Object.defineProperty(GomlVpTag.prototype, "TagName", {
		            get: function () {
		                return "VP";
		            },
		            enumerable: true,
		            configurable: true
		        });
		        return GomlVpTag;
		    })(GomlTagBase);
		    jThree.GomlVpTag = GomlVpTag;
		    var GomlTreeNodeBase = (function (_super) {
		        __extends(GomlTreeNodeBase, _super);
		        function GomlTreeNodeBase(elem) {
		            _super.call(this);
		            this.children = [];
		            this.element = elem;
		        }
		        GomlTreeNodeBase.prototype.addChild = function (child) {
		            child.parent = this;
		            this.children.push(child);
		        };
		        return GomlTreeNodeBase;
		    })(JThreeObjectWithId);
		    jThree.GomlTreeNodeBase = GomlTreeNodeBase;
		    var GomlTreeRdrNode = (function (_super) {
		        __extends(GomlTreeRdrNode, _super);
		        function GomlTreeRdrNode(elem) {
		            _super.call(this, elem);
		            var test = $(elem);
		            console.log("css test:" + $(test).css("clearcolor"));
		            var targetCanvas = $("<canvas></canvas>");
		            targetCanvas.addClass("x-j3-c-" + this.ID);
		            $(this.Frame).append(targetCanvas);
		            this.canvasManager = CanvasManager.fromCanvas(targetCanvas[0]);
		            var scene = new jThree.Scene();
		            scene.addRenderer(this.canvasManager.getDefaultViewport());
		            JThreeContext.Instance.SceneManager.addScene(scene);
		        }
		        Object.defineProperty(GomlTreeRdrNode.prototype, "Frame", {
		            get: function () {
		                return this.element.getAttribute("frame") || "body";
		            },
		            enumerable: true,
		            configurable: true
		        });
		        return GomlTreeRdrNode;
		    })(GomlTreeNodeBase);
		    jThree.GomlTreeRdrNode = GomlTreeRdrNode;
		    var GomlTreeVpNode = (function (_super) {
		        __extends(GomlTreeVpNode, _super);
		        function GomlTreeVpNode(elem) {
		            _super.call(this, elem);
		        }
		        return GomlTreeVpNode;
		    })(GomlTreeNodeBase);
		    jThree.GomlTreeVpNode = GomlTreeVpNode;
		})(jThree || (jThree = {}));
		var buf;
		var time = 0;
		var noInit;
		$(function () {
		    if (noInit)
		        return;
		    var jThreeContext = jThree.JThreeContext.Instance;
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
		//# sourceMappingURL=jThree.js.map

	/***/ }
	/******/ ]);

/***/ }
/******/ ]);