import AsyncLoader from "../../Core/Resources/AsyncLoader";
import { quat } from "gl-matrix";
import BezierCurve from "./BezierCurve";
import Q from "q";
class VMDData {
    constructor(data) {
        this._offset = 0;
        this._reader = new DataView(data, 0, data.byteLength);
        this._loadHeader();
        this._loadMotion();
        this._loadMorph();
    }
    static loadFromUrl(url) {
        return VMDData._asyncLoader.fetch(url, (path) => {
            const d = Q.defer();
            const oReq = new XMLHttpRequest();
            oReq.open("GET", path, true);
            oReq.setRequestHeader("Accept", "*/*");
            oReq.responseType = "arraybuffer";
            oReq.onload = () => {
                const data = new VMDData(oReq.response);
                d.resolve(data);
            };
            oReq.onerror = (err) => {
                d.reject(err);
            };
            oReq.send(null);
            return d.promise;
        });
    }
    get Motions() {
        return this._motions;
    }
    get Morphs() {
        return this._morphs;
    }
    getBoneFrame(frame, boneName) {
        const frames = this._motions[boneName];
        if (typeof frames === "undefined") {
            return null;
        }
        else {
            const index = this._binaryframeSearch(frames, frame);
            if (index + 1 < frames.length) {
                const nextFrame = frames[index + 1];
                const currentFrame = frames[index];
                const progress = (frame - currentFrame.frameNumber) / (nextFrame.frameNumber - currentFrame.frameNumber);
                return {
                    frameNumber: frame,
                    position: this._complementBoneTranslation(currentFrame.position, nextFrame.position, progress, currentFrame.interpolation),
                    rotation: quat.slerp([0, 0, 0, 0], currentFrame.rotation, nextFrame.rotation, currentFrame.interpolation[3].evaluate(progress))
                };
            }
            else {
                return {
                    frameNumber: frame,
                    position: frames[index].position,
                    rotation: frames[index].rotation
                };
            }
        }
    }
    getMorphFrame(frame, morphName) {
        const frames = this._morphs[morphName];
        if (typeof frames === "undefined") {
            return null;
        }
        else {
            const index = this._binaryframeSearch(frames, frame);
            if (index + 1 < frames.length) {
                const nextFrame = frames[index + 1];
                const currentFrame = frames[index];
                const progress = (frame - currentFrame.frameNumber) / (nextFrame.frameNumber - currentFrame.frameNumber);
                return {
                    frameNumber: frame,
                    value: currentFrame.morphValue + (nextFrame.morphValue - currentFrame.morphValue) * progress,
                };
            }
            else {
                return {
                    frameNumber: frame,
                    value: frames[index].morphValue,
                };
            }
        }
    }
    _loadHeader() {
        this._header
            = {
                header: this._loadString(30),
                modelName: this._loadString(20)
            };
    }
    _loadMotion() {
        this._motions = {};
        const frameCount = this._readUint32();
        for (let i = 0; i < frameCount; i++) {
            const frameName = this._loadString(15);
            const data = {
                frameNumber: this._readUint32(),
                position: [this._readFloat32(), this._readFloat32(), -this._readFloat32()],
                rotation: [-this._readFloat32(), -this._readFloat32(), this._readFloat32(), this._readFloat32()],
                interpolation: this._loadInterpolation()
            };
            if (typeof this._motions[frameName] === "undefined") {
                this._motions[frameName] = [];
            }
            this._motions[frameName].push(data);
        }
        for (let motion in this._motions) {
            this._motions[motion].sort((i1, i2) => i1.frameNumber - i2.frameNumber);
        }
    }
    _loadMorph() {
        this._morphs = {};
        const frameCount = this._readUint32();
        for (let i = 0; i < frameCount; i++) {
            const frameName = this._loadString(15);
            const data = {
                frameNumber: this._readUint32(),
                morphValue: this._readFloat32()
            };
            if (typeof this._morphs[frameName] === "undefined") {
                this._morphs[frameName] = [];
            }
            this._morphs[frameName].push(data);
        }
        for (let morph in this._morphs) {
            this._morphs[morph].sort((i1, i2) => i1.frameNumber - i2.frameNumber);
        }
    }
    _loadBytes(byteLength) {
        let isPadding = false;
        const arr = [];
        for (let i = 0; i < byteLength; i++) {
            const current = this._readUint8();
            if (current === 0x00) {
                isPadding = true;
            }
            if (!isPadding) {
                arr.push(current);
            }
        }
        return new Uint8Array(arr);
    }
    _loadString(length) {
        const decoder = new TextDecoder("shift-jis");
        return decoder.decode(this._loadBytes(length));
    }
    _loadInterpolation() {
        const interpolation = new Array(4);
        for (let i = 0; i < 4; i++) {
            interpolation[i] = new Array(4);
            for (let j = 0; j < 4; j++) {
                interpolation[i][j] = new Array(4);
            }
        }
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    interpolation[i][j][k] = this._readUint8();
                }
            }
        }
        const result = new Array(4);
        for (let i = 0; i < 4; i++) {
            result[i] = new BezierCurve(interpolation[0][0][i] / 128.0, interpolation[0][1][i] / 128.0, interpolation[0][2][i] / 128.0, interpolation[0][3][i] / 128);
        }
        return result;
    }
    _binaryframeSearch(source, frame) {
        let minIndex = 0;
        let maxIndex = source.length - 1;
        let currentIndex = -1;
        let currentElement;
        if (source.length === 1) {
            return 0;
        }
        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = source[currentIndex];
            if (currentElement.frameNumber < frame) {
                if (currentIndex + 1 < source.length && source[currentIndex + 1].frameNumber > frame) {
                    return currentIndex;
                }
                minIndex = currentIndex + 1;
            }
            else if (currentElement.frameNumber > frame) {
                maxIndex = currentIndex - 1;
                if (currentIndex - 1 >= 0 && source[currentIndex - 1].frameNumber < frame) {
                    return currentIndex - 1;
                }
            }
            else {
                return currentIndex;
            }
        }
        return currentIndex;
    }
    _complementBoneTranslation(begin, end, progress, bezierCurves) {
        const result = [0, 0, 0]; // TODO optimize this
        for (let i = 0; i < 3; i++) {
            result[i] = begin[i] + (end[i] - begin[i]) * bezierCurves[i].evaluate(progress);
        }
        return result;
    }
    _readUint8() {
        const result = this._reader.getUint8(this._offset);
        this._offset += 1;
        return result;
    }
    _readUint32() {
        const result = this._reader.getUint32(this._offset, true);
        this._offset += 4;
        return result;
    }
    _readFloat32() {
        const result = this._reader.getFloat32(this._offset, true);
        this._offset += 4;
        return result;
    }
}
VMDData._asyncLoader = new AsyncLoader();
export default VMDData;
