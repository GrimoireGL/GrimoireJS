import VMDHeader = require("./VMDHeader");
import VMDMotion = require("./VMDMotion");
import VMDMorph = require("./VMDMorph");
import VMDFrameData = require("./VMDFrameData");
import VMDBoneStatus= require("./VMDBoneStatus");
import Delegates = require("../../Base/Delegates");
import VMDMorphStatus = require("./VMDMorphStatus");
import glm = require("glm");
class VMDData {

	public static LoadFromUrl(url: string, onComplete: Delegates.Action1<VMDData>) {
		var targetUrl = url;
		var oReq = new XMLHttpRequest();
		oReq.open("GET", targetUrl, true);
		oReq.setRequestHeader("Accept", "*/*");
		oReq.responseType = "arraybuffer";
		oReq.onload = () => {
			var data = new VMDData(oReq.response);
			onComplete(data);
		};
		oReq.send(null);
	}

	private reader: jDataView;

	private header: VMDHeader;

	private motions: VMDMotion;

	private morphs: VMDMorph;

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
		var result = new Uint8Array(64);
		for (var i = 0; i < 64; i++) {
			result[i] = this.reader.getUint8();
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
					position:<number[]>glm.vec3.lerp([0,0,0],currentFrame.position,nextFrame.position,progress),
					rotation:<number[]>glm.quat.slerp([0,0,0,0],currentFrame.rotation,nextFrame.rotation,progress)

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
                if (typeof nextFrame === 'undefined') {
                    console.warn(`nextFrame is undefined at index ${index+1}`);
                }
                if (typeof currentFrame === 'undefined')
                {
                    console.warn(`currentFrame is undefined at index ${index}`);
                    console.log(frames);
                }
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