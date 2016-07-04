import ResourceResolver from "./Resources/ResourceResolver";
import ImageLoader from "./Resources/ImageLoader";
import EEObject from "../Base/EEObject";
import Buffer from "./Resources/Buffer/Buffer";
import Shader from "./Resources/Shader/Shader";
import Program from "./Resources/Program/Program";
import Texture from "./Resources/Texture/Texture";
import RBO from "./Resources/RBO/RBO";
import ResourceArray from "./Resources/ResourceArray";
import FBO from "./Resources/FBO/FBO";
import BufferTexture from "./Resources/Texture/BufferTexture";
import TextureBase from "./Resources/Texture/TextureBase";
import CubeTexture from "./Resources/Texture/CubeTexture";
import Q from "q";
type ImageSource = HTMLCanvasElement | HTMLImageElement | ImageData | ArrayBufferView;

/**
 * コンテキストを跨いでリソースを管理するクラスをまとめているクラス
 */
class ResourceManager extends EEObject {

    public static instance: ResourceManager;

    private _buffers: ResourceArray<Buffer> = new ResourceArray<Buffer>();

    private _shaders: ResourceArray<Shader> = new ResourceArray<Shader>();

    private _programs: ResourceArray<Program> = new ResourceArray<Program>();

    private _textures: ResourceArray<TextureBase> = new ResourceArray<TextureBase>();

    private _rbos: ResourceArray<RBO> = new ResourceArray<RBO>();

    private _fbos: ResourceArray<FBO> = new ResourceArray<FBO>();

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
            absPaths[i] = ResourceResolver.getAbsolutePath(srcs[i]);
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

    public createBuffer(id: string, target: number, usage: number, unitCount: number, elementType: number): Buffer {
        return this._buffers.create(id, () => {
            return new Buffer(target, usage, unitCount, elementType);
        });
    }

    public getBuffer(id: string): Buffer {
        return this._buffers.get(id);
    }

    public createShader(id: string, source: string, shaderType: number): Shader {
        return this._shaders.create(id, () => {
            return Shader.createShader(source, shaderType);
        });
    }

    public getShader(id: string): Shader {
        return this._shaders.get(id);
    }

    public hasShader(id: string): boolean {
        return this._shaders.has(id);
    }

    public createProgram(id: string, vert: Shader, frag: Shader): Program {
        return this._programs.create(id, () => {
            return Program.createProgram(vert, frag);
        });
    }

    public getProgram(id: string): Program {
        return this._programs.get(id);
    }

    public createTextureWithSource(id: string, source: ImageSource): Texture {
        return <Texture>this._textures.create(id, () => {
            const tex = new Texture(source, id);
            tex.each(v => v.init()); // TODO no need?
            return tex;
        });
    }


    public getTexture(id: string): TextureBase {
        return <TextureBase>this._textures.get(id);
    }

    public createCubeTextureWithSource(id: string, sources: ImageSource[], flipY = false): CubeTexture {
        return <CubeTexture>this._textures.create(id, () => {
            const cubeTexture = new CubeTexture(sources, id, flipY);
            cubeTexture.each(v => v.init());
            return cubeTexture;
        });
    }

    public createRBO(id: string, width: number, height: number): RBO {
        return this._rbos.create(id, () => {
            const r = new RBO(width, height);
            r.each(v => v.init());
            return r;
        });
    }

    public getRBO(id: string): RBO {
        return this._rbos.get(id);
    }

    public createFBO(id: string): FBO {
        return this._fbos.create(id, () => {
            const fbo = new FBO();
            fbo.each(v => v.init());
            return fbo;
        });
    }

    public getFBO(id: string): FBO {
        return this._fbos.get(id);
    }

    public createTexture(id: string, width: number, height: number, texType: number = WebGLRenderingContext.RGBA, elemType: number = WebGLRenderingContext.UNSIGNED_BYTE): BufferTexture {
        return this._textures.create(id, () => {
            const bt = new BufferTexture(width, height, texType, elemType, id);
            bt.each(v => v.init());
            return bt;
        });
    }
}

ResourceManager.instance = new ResourceManager();
export default ResourceManager.instance;
