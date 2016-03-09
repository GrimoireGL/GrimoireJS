import AsyncLoader from "./Resources/AsyncLoader";
import ImageLoader from "./Resources/ImageLoader";
import jThreeObject from "../Base/JThreeObject";
import Buffer from "./Resources/Buffer/Buffer";
import Shader from "./Resources/Shader/Shader";
import Program from "./Resources/Program/Program";
import Texture from "./Resources/Texture/Texture";
import RBO from "./Resources/RBO/RBO";
import ResourceArray from "./Resources/ResourceArray";
import FBO from "./Resources/FBO/FBO";
import BufferTexture from "./Resources/Texture/BufferTexture";
import CubeTexture from "./Resources/Texture/CubeTexture";
import ContextComponents from "../ContextComponents";
import Q from "q";
/**
 * コンテキストを跨いでリソースを管理するクラスをまとめているクラス
 */
class ResourceManager extends jThreeObject {
    constructor(...args) {
        super(...args);
        this._buffers = new ResourceArray();
        this._shaders = new ResourceArray();
        this._programs = new ResourceArray();
        this._textures = new ResourceArray();
        this._rbos = new ResourceArray();
        this._fbos = new ResourceArray();
    }
    getContextComponentIndex() {
        return ContextComponents.ResourceManager;
    }
    loadTexture(src) {
        const deferred = Q.defer();
        if (this.getTexture(src)) {
            process.nextTick(() => {
                deferred.resolve(this.getTexture(src));
            });
        }
        ImageLoader.loadImage(src).then((tag) => {
            const texture = this.createTextureWithSource(src, tag);
            deferred.resolve(texture);
        }, (error) => {
            console.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    }
    loadCubeTexture(srcs) {
        const deferred = Q.defer();
        let id = "";
        let absPaths = [, , , , ,];
        for (let i = 0; i < 6; i++) {
            absPaths[i] = AsyncLoader.getAbsolutePath(srcs[i]);
            id += absPaths[i];
        }
        if (this.getTexture(id)) {
            process.nextTick(() => {
                deferred.resolve(this.getTexture(id));
            });
        }
        else {
            const promises = [, , , , ,];
            for (let i = 0; i < 6; i++) {
                promises[i] = ImageLoader.loadImage(absPaths[i]);
            }
            Q.all(promises).then((textures) => {
                deferred.resolve(this.createCubeTextureWithSource(id, textures, false));
            });
        }
        return deferred.promise;
    }
    createBuffer(id, target, usage, unitCount, elementType) {
        return this._buffers.create(id, () => {
            return new Buffer(target, usage, unitCount, elementType);
        });
    }
    getBuffer(id) {
        return this._buffers.get(id);
    }
    createShader(id, source, shaderType) {
        return this._shaders.create(id, () => {
            return Shader.createShader(source, shaderType);
        });
    }
    getShader(id) {
        return this._shaders.get(id);
    }
    hasShader(id) {
        return this._shaders.has(id);
    }
    createProgram(id, shaders) {
        return this._programs.create(id, () => {
            return Program.createProgram(shaders);
        });
    }
    getProgram(id) {
        return this._programs.get(id);
    }
    createTextureWithSource(id, source) {
        return this._textures.create(id, () => {
            const tex = new Texture(source, id);
            tex.each(v => v.init()); // TODO no need?
            return tex;
        });
    }
    getTexture(id) {
        return this._textures.get(id);
    }
    createCubeTextureWithSource(id, sources, flipY = false) {
        return this._textures.create(id, () => {
            const cubeTexture = new CubeTexture(sources, id, flipY);
            cubeTexture.each(v => v.init());
            return cubeTexture;
        });
    }
    createRBO(id, width, height) {
        return this._rbos.create(id, () => {
            const r = new RBO(width, height);
            r.each(v => v.init());
            return r;
        });
    }
    getRBO(id) {
        return this._rbos.get(id);
    }
    createFBO(id) {
        return this._fbos.create(id, () => {
            const fbo = new FBO();
            fbo.each(v => v.init());
            return fbo;
        });
    }
    getFBO(id) {
        return this._fbos.get(id);
    }
    createTexture(id, width, height, texType = WebGLRenderingContext.RGBA, elemType = WebGLRenderingContext.UNSIGNED_BYTE) {
        return this._textures.create(id, () => {
            const bt = new BufferTexture(width, height, texType, elemType, id);
            bt.each(v => v.init());
            return bt;
        });
    }
}
export default ResourceManager;
