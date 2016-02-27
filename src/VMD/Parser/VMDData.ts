import AsyncLoader from "../../Core/Resources/AsyncLoader";
import VMDHeader from "./VMDHeader";
import VMDMotions from "./VMDMotions";
import VMDMorphs from "./VMDMorphs";
import VMDFrameData from "./VMDFrameData";
import VMDBoneStatus from "./VMDBoneStatus";
import VMDMorphStatus from "./VMDMorphStatus";
import {quat} from "gl-matrix";
import BezierCurve from "./BezierCurve";
import Q from "q";

class VMDData {

  private static _asyncLoader: AsyncLoader<VMDData> = new AsyncLoader<VMDData>();

  private reader: DataView;

  private header: VMDHeader;

  private motions: VMDMotions;

  private morphs: VMDMorphs;

  private _offset: number = 0;

  constructor(data: ArrayBuffer) {
    this.reader = new DataView(data, 0, data.byteLength);
    this.loadHeader();
    this.loadMotion();
    this.loadMorph();
  }

  public static LoadFromUrl(url: string): Q.IPromise<VMDData> {
    return VMDData._asyncLoader.fetch(url, (path) => {
      const d = Q.defer<VMDData>();
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


  public get Motions() {
    return this.motions;
  }

  public get Morphs() {
    return this.morphs;
  }

  public getBoneFrame(frame: number, boneName: string): VMDBoneStatus {
    const frames = this.motions[boneName];
    if (typeof frames === "undefined") {
      return null;
    } else {
      const index = this.binaryframeSearch(frames, frame);
      if (index + 1 < frames.length) {
        const nextFrame = frames[index + 1];
        const currentFrame = frames[index];
        const progress = (frame - currentFrame.frameNumber) / (nextFrame.frameNumber - currentFrame.frameNumber);
        return {
          frameNumber: frame,
          position: this.complementBoneTranslation(currentFrame.position, nextFrame.position, progress, currentFrame.interpolation),
          rotation: <number[]>quat.slerp([0, 0, 0, 0], currentFrame.rotation, nextFrame.rotation, currentFrame.interpolation[3].evaluate(progress))
        };
      } else {
        return {
          frameNumber: frame,
          position: frames[index].position,
          rotation: frames[index].rotation
        };
      }
    }
  }

  public getMorphFrame(frame: number, morphName: string): VMDMorphStatus {
    const frames = this.morphs[morphName];
    if (typeof frames === "undefined") {
      return null;
    } else {
      const index = this.binaryframeSearch(frames, frame);
      if (index + 1 < frames.length) {
        const nextFrame = frames[index + 1];
        const currentFrame = frames[index];
        const progress = (frame - currentFrame.frameNumber) / (nextFrame.frameNumber - currentFrame.frameNumber);
        return {
          frameNumber: frame,
          value: currentFrame.morphValue + (nextFrame.morphValue - currentFrame.morphValue) * progress,
        };
      } else {
        return {
          frameNumber: frame,
          value: frames[index].morphValue,
        };
      }
    }
  }


  private loadHeader() {
    this.header
    = {
      header: this.loadString(30),
      modelName: this.loadString(20)
    };
  }

  private loadMotion() {
    this.motions = {};
    const frameCount = this._readUint32();
    for (let i = 0; i < frameCount; i++) {
      const frameName = this.loadString(15);
      const data = {
        frameNumber: this._readUint32(),
        position: [this._readFloat32(), this._readFloat32(), -this._readFloat32()],
        rotation: [-this._readFloat32(), -this._readFloat32(), this._readFloat32(), this._readFloat32()],
        interpolation: this.loadInterpolation()
      };
      if (typeof this.motions[frameName] === "undefined") {
        this.motions[frameName] = [];
      }
      this.motions[frameName].push(data);
    }
    for (let motion in this.motions) { // sort each bone frames
      this.motions[motion].sort((i1, i2) => i1.frameNumber - i2.frameNumber);
    }
  }

  private loadMorph() {
    this.morphs = {};
    const frameCount = this._readUint32();
    for (let i = 0; i < frameCount; i++) {
      const frameName = this.loadString(15);
      const data = {
        frameNumber: this._readUint32(),
        morphValue: this._readFloat32()
      };
      if (typeof this.morphs[frameName] === "undefined") {
        this.morphs[frameName] = [];
      }
      this.morphs[frameName].push(data);
    }
    for (let morph in this.morphs) {
      this.morphs[morph].sort((i1, i2) => i1.frameNumber - i2.frameNumber);
    }
  }

  private loadBytes(byteLength: number) {
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

  private loadString(length: number) {
    const decoder = new TextDecoder("shift-jis");
    return decoder.decode(this.loadBytes(length));
  }

  private loadInterpolation(): BezierCurve[] {
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

  private binaryframeSearch(source: VMDFrameData[], frame: number) {
    let minIndex = 0;
    let maxIndex = source.length - 1;
    let currentIndex = -1;
    let currentElement: VMDFrameData;
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
      } else if (currentElement.frameNumber > frame) {
        maxIndex = currentIndex - 1;
        if (currentIndex - 1 >= 0 && source[currentIndex - 1].frameNumber < frame) {
          return currentIndex - 1;
        }
      } else {
        return currentIndex;
      }
    }
    return currentIndex;
  }


  private complementBoneTranslation(begin: number[], end: number[], progress: number, bezierCurves: BezierCurve[]) {
    const result = [0, 0, 0]; // TODO optimize this
    for (let i = 0; i < 3; i++) {
      result[i] = begin[i] + (end[i] - begin[i]) * bezierCurves[i].evaluate(progress);
    }
    return result;
  }


  private _readUint8(): number {
    const result = this.reader.getUint8(this._offset);
    this._offset += 1;
    return result;
  }

  private _readUint32(): number {
    const result = this.reader.getUint32(this._offset, true);
    this._offset += 4;
    return result;
  }

  private _readFloat32(): number {
    const result = this.reader.getFloat32(this._offset, true);
    this._offset += 4;
    return result;
  }
}

export default VMDData;
