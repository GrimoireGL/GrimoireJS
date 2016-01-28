import AsyncLoader = require("./Resources/AsyncLoader");
import ImageLoader = require("./Resources/ImageLoader");
﻿import BufferTargetType = require("../Wrapper/BufferTargetType");
import BufferUsageType = require("../Wrapper/BufferUsageType");
import ElementType = require("../Wrapper/ElementType");
import ShaderType = require("../Wrapper/ShaderType");
import Delegates = require("../Base/Delegates");
import jThreeObject = require("../Base/JThreeObject");
import Buffer = require("./Resources/Buffer/Buffer");
import Shader = require("./Resources/Shader/Shader");
import Program = require("./Resources/Program/Program");
import Texture = require("./Resources/Texture/Texture");
import RBO = require("./Resources/RBO/RBO");
import ResourceArray = require("./Resources/ResourceArray");
import FBO = require("./Resources/FBO/FBO");
import BufferTexture = require("./Resources/Texture/BufferTexture");
import TextureFormat = require("../Wrapper/TextureInternalFormatType");
import ElementFormat = require("../Wrapper/TextureType");
import TextureBase = require("./Resources/Texture/TextureBase");
import CubeTexture = require("./Resources/Texture/CubeTexture");
import IContextComponent = require("../IContextComponent");
import ContextComponents = require("../ContextComponents");
import Q = require("q");
type ImageSource = HTMLCanvasElement | HTMLImageElement | ImageData | ArrayBufferView;

/**
 * コンテキストを跨いでリソースを管理するクラスをまとめているクラス
 */
class ResourceManager extends jThreeObject implements IContextComponent {
  public getContextComponentIndex(): number {
    return ContextComponents.ResourceManager;
  }

  public loadTexture(src: string): Q.IPromise<TextureBase> {
    const deferred = Q.defer<TextureBase>();
    if (this.getTexture(src)) { // When the requested texture was loaded already
      process.nextTick(() => {
        deferred.resolve(this.getTexture(src));
      });
    }
    ImageLoader.loadImage(src).then((tag) => { // When the requested texture was not loaded yet
      const texture = this.createTextureWithSource(src, tag);
      deferred.resolve(texture);
    }, (error) => {
        console.error(error);
        deferred.reject(error);
      });
    return deferred.promise;
  }

  public loadCubeTexture(srcs: string[]): Q.IPromise<CubeTexture> {
    const deferred = Q.defer<CubeTexture>();
    let id = "";
    let absPaths = [, , , , , ];
    for (let i = 0; i < 6; i++) {
      absPaths[i] = AsyncLoader.getAbsolutePath(srcs[i]);
      id += absPaths[i];
    }
    if (this.getTexture(id)) {
      process.nextTick(() => {
        deferred.resolve(<CubeTexture>this.getTexture(id));
      });
    } else {
      const promises: Q.IPromise<HTMLImageElement>[] = [, , , , , ];
      for (let i = 0; i < 6; i++) {
        promises[i] = ImageLoader.loadImage(absPaths[i]);
      }
      Q.all(promises).then((textures) => {
        deferred.resolve(this.createCubeTextureWithSource(id, textures, false));
      });
    }
    return deferred.promise;
  }

  private buffers: ResourceArray<Buffer> = new ResourceArray<Buffer>();

  public createBuffer(id: string, target: BufferTargetType, usage: BufferUsageType, unitCount: number, elementType: ElementType): Buffer {
    return this.buffers.create(id, () => {
      return new Buffer(target, usage, unitCount, elementType);
    });
  }

  public getBuffer(id: string): Buffer {
    return this.buffers.get(id);
  }

  private shaders: ResourceArray<Shader> = new ResourceArray<Shader>();

  public createShader(id: string, source: string, shaderType: ShaderType): Shader {
    return this.shaders.create(id, () => {
      return Shader.CreateShader(source, shaderType);
    });
  }

  public getShader(id: string): Shader {
    return this.shaders.get(id);
  }

  public hasShader(id: string): boolean {
    return this.shaders.has(id);
  }

  private programs: ResourceArray<Program> = new ResourceArray<Program>();

  public createProgram(id: string, shaders: Shader[]): Program {
    return this.programs.create(id, () => {
      return Program.CreateProgram(shaders);
    });
  }

  public getProgram(id: string): Program {
    return this.programs.get(id);
  }

  private textures: ResourceArray<TextureBase> = new ResourceArray<TextureBase>();

  public createTextureWithSource(id: string, source: ImageSource): Texture {
    return <Texture>this.textures.create(id, () => {
      const tex = new Texture(source, id);
      tex.each(v => v.init()); // TODO no need?
      return tex;
    });
  }


  public getTexture(id: string): TextureBase {
    return <TextureBase>this.textures.get(id);
  }

  public createCubeTextureWithSource(id: string, sources: ImageSource[], flipY = false): CubeTexture {
    return <CubeTexture>this.textures.create(id, () => {
      const cubeTexture = new CubeTexture(sources, id, flipY);
      cubeTexture.each(v => v.init());
      return cubeTexture;
    });
  }

  public getTextureHandler(id: string, handler: Delegates.Action1<Texture>) {
    this.textures.getHandler(id, handler);
  }

  private rbos: ResourceArray<RBO> = new ResourceArray<RBO>(
    );

  public createRBO(id: string, width: number, height: number): RBO {
    return this.rbos.create(id, () => {
      const r = new RBO(width, height);
      r.each(v => v.init());
      return r;
    });
  }

  public getRBO(id: string): RBO {
    return this.rbos.get(id);
  }

  private fbos: ResourceArray<FBO> = new ResourceArray<FBO>();

  public createFBO(id: string): FBO {
    return this.fbos.create(id, () => {
      const fbo = new FBO();
      fbo.each(v => v.init());
      return fbo;
    });
  }

  public getFBO(id: string): FBO {
    return this.fbos.get(id);
  }

  public createTexture(id: string, width: number, height: number, texType: TextureFormat = TextureFormat.RGBA, elemType: ElementFormat = ElementFormat.UnsignedByte) {
    return this.textures.create(id, () => {
      const bt = new BufferTexture(width, height, texType, elemType, id);
      bt.each(v => v.init());
      return bt;
    });
  }

  public toString() {
    return `buffer:${this.buffers.toString() }\nshader:${this.shaders.toString() }\nprograms:${this.programs.toString() }\ntexture:${this.textures.toString() }`;
  }
}
export = ResourceManager;
