import VMDHeader = require("./VMDHeader");
import VMDMotions = require("./VMDMotions");
import VMDMorphs = require("./VMDMorphs");
import VMDFrameData = require("./VMDFrameData");
import VMDBoneStatus= require("./VMDBoneStatus");
import Delegates = require("../../Base/Delegates");
import VMDMorphStatus = require("./VMDMorphStatus");
import glm = require("gl-matrix");
import BezierCurve = require("./BezierCurve");
import Q = require("q");
class VMDData {

	public static LoadFromUrl(url: string):Q.Promise<VMDData> {
		var d = Q.defer<VMDData>();
		var targetUrl = url;
		var oReq = new XMLHttpRequest();
		oReq.open("GET", targetUrl, true);
		oReq.setRequestHeader("Accept", "*/*");
		oReq.responseType = "arraybuffer";
		oReq.onload = () => {
			var data = new VMDData(oReq.response);
			d.resolve(data);
		};
		oReq.send(null);
		return d.promise;
	}

	private reader: jDataView;

	private header: VMDHeader;

	private motions: VMDMotions;

	private morphs: VMDMorphs;

	public get Motions()
	{
		return this.motions;
	}

	public get Morphs()
	{
		return this.morphs;
	}

	constructor(data: ArrayBuffer) {
		this.reader = new jDataView(data, 0, data.byteLength, true);
		this.loadHeader();
		this.loadMotion();
		this.loadMorph();
	}

	private loadHeader() {
		var r = this.reader;
		this.header
		= {
			header: this.loadString(30),
			modelName: this.loadString(20)
		};
	}

	private loadMotion() {
		this.motions = {};
		var r = this.reader;
		var frameCount = r.getUint32();
		for (var i = 0; i < frameCount; i++) {
			var frameName = this.loadString(15);
			var data =
				{
					frameNumber: r.getUint32(),
					position: [r.getFloat32(), r.getFloat32(), -r.getFloat32()],
					rotation: [-r.getFloat32(),-r.getFloat32(), r.getFloat32(), r.getFloat32()],
					interpolation: this.loadInterpolation()
				};
			if (typeof this.motions[frameName] === "undefined") {
				this.motions[frameName] = [];
			}
			this.motions[frameName].push(data);
		}
		for(var motion in this.motions)
		{//sort each bone frames
			this.motions[motion].sort((i1,i2)=>i1.frameNumber-i2.frameNumber);
		}
	}

	private loadMorph() {
		this.morphs = {};
		var r = this.reader;
		var frameCount = r.getUint32();
		for (var i = 0; i < frameCount; i++) {
			var frameName = this.loadString(15);
			var data =
				{
					frameNumber: r.getUint32(),
					morphValue: r.getFloat32()
				};
			if (typeof this.morphs[frameName] === "undefined") {
				this.morphs[frameName] = [];
			}
			this.morphs[frameName].push(data);
		}
		for(var morph in this.morphs)
		{
			this.morphs[morph].sort((i1,i2)=>i1.frameNumber - i2.frameNumber);
		}
	}

	private loadBytes(byteLength: number) {
		var isPadding = false;
		var arr = [];
		for (var i = 0; i < byteLength; i++) {
			var current = this.reader.getUint8();
			if (current == 0x00) {
				isPadding = true;
			}
			if (!isPadding) arr.push(current);
		}
		return new Uint8Array(arr);
	}

	private loadString(length: number) {
		var decoder = new TextDecoder("shift-jis");
		return decoder.decode(this.loadBytes(length));
	}

	private loadInterpolation() {
		var interpolation = new Array(4);
		for(var i = 0; i < 4; i++)
		{
			interpolation[i] = new Array(4);
			for(var j = 0; j < 4; j++)
			{
				interpolation[i][j]=new Array(4);
			}
		}
		for(var i = 0; i < 4; i++)
			for(var j = 0; j < 4; j++)
				for(var k = 0; k < 4; k++)
					interpolation[i][j][k] = this.reader.getUint8();
		var result = new Array(4);
		for(var i = 0; i < 4; i++)
		{
      result[i] = new BezierCurve(interpolation[0][0][i] / 128.0,interpolation[0][1][i] / 128.0,interpolation[0][2][i] / 128.0,interpolation[0][3][i] / 128);
		}
		return result;
	}

	private binaryframeSearch(source: VMDFrameData[], frame: number) {
		var minIndex = 0;
		var maxIndex = source.length - 1;
		var currentIndex=-1;
		var currentElement: VMDFrameData;
		if (source.length == 1) return 0;
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
				if (currentIndex-1 >=0&& source[currentIndex - 1].frameNumber <frame) {
					return currentIndex-1;
				}
			}
			else {
				return currentIndex;
			}
        }
		return currentIndex;
	}

	public getBoneFrame(frame:number,boneName:string):VMDBoneStatus
	{
		var frames = this.motions[boneName];
		if(typeof frames === "undefined")
		{
			return null;
		}else
		{
			var index=this.binaryframeSearch(frames, frame);
			if(index+1<frames.length)
			{
				var nextFrame = frames[index + 1];
			    var currentFrame = frames[index];
				var progress = (frame-currentFrame.frameNumber)/(nextFrame.frameNumber-currentFrame.frameNumber);
				return {
					frameNumber:frame,
					position:this.complementBoneTranslation(currentFrame.position,nextFrame.position,progress,currentFrame.interpolation),
					rotation:<number[]>glm.quat.slerp([0,0,0,0],currentFrame.rotation,nextFrame.rotation,currentFrame.interpolation[3].evaluate(progress))
				}
			}else
			{
				return {
					frameNumber:frame,
					position:frames[index].position,
					rotation:frames[index].rotation
				};
			}
		}
	}

	private complementBoneTranslation(begin:number[],end:number[],progress:number,bezierCurves:BezierCurve[])
	{
		var result = [0,0,0];//TODO optimize this
		for(var i = 0; i < 3; i++)
			result[i] = begin[i] + (end[i] - begin[i]) * bezierCurves[i].evaluate(progress);
		return result;
	}

	public getMorphFrame(frame:number,morphName:string):VMDMorphStatus
	{
		var frames = this.morphs[morphName];
		if(typeof frames === "undefined")
		{
			return null;
		}else
		{
			var index=this.binaryframeSearch(frames, frame);
			if(index+1<frames.length)
			{
				var nextFrame = frames[index + 1];
        var currentFrame = frames[index];
				var progress = (frame-currentFrame.frameNumber)/(nextFrame.frameNumber-currentFrame.frameNumber);
				return {
					frameNumber:frame,
					value:currentFrame.morphValue+(nextFrame.morphValue	-currentFrame.morphValue)*progress,
				}
			}else
			{
				return {
					frameNumber:frame,
					value:frames[index].morphValue,
				};
			}
		}
	}
}

export = VMDData;
