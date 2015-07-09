import PMXHeader = require('./PMXHeader');
import PMXVerticies = require('./PMXVerticies');
class PMX {
	private reader: BinaryReader;

	private header: PMXHeader;

	private verticies: PMXVerticies;

	constructor(data: string) {
		this.reader = new BinaryReader(data);
		this.loadHeader();
		this.loadVerticies();
	}

	private readTextBuf(): string {
		var length = this.reader.readInt32();
		return this.reader.readString(length);
	}

	private toUTF8(str: string) {
		var utf8 = [];
		for (var i = 0; i < str.length; i++) {
			var charcode = str.charCodeAt(i);
			if (charcode < 0x80) utf8.push(charcode);
			else if (charcode < 0x800) {
				utf8.push(0xc0 | (charcode >> 6),
					0x80 | (charcode & 0x3f));
			}
			else if (charcode < 0xd800 || charcode >= 0xe000) {
				utf8.push(0xe0 | (charcode >> 12),
					0x80 | ((charcode >> 6) & 0x3f),
					0x80 | (charcode & 0x3f));
			}
			// surrogate pair
			else {
				i++;
				// UTF-16 encodes 0x10000-0x10FFFF by
				// subtracting 0x10000 and splitting the
				// 20 bits of 0x0-0xFFFFF into two halves
				charcode = 0x10000 + (((charcode & 0x3ff) << 10)
					| (str.charCodeAt(i) & 0x3ff))
				utf8.push(0xf0 | (charcode >> 18),
					0x80 | ((charcode >> 12) & 0x3f),
					0x80 | ((charcode >> 6) & 0x3f),
					0x80 | (charcode & 0x3f));
			}
		}
		var text = "";
		for (var i = 0; i < utf8.length; i++) {
			text += String.fromCharCode(utf8[i]);
		}
		return text;
	}

	private loadHeader() {
		var r = this.reader;
		this.reader.readUInt32();//pass magic
		this.header =
		{
			version: r.readFloat(),
			headerByteSize: r.readUInt8(),
			encoding: r.readUInt8(),
			uvAddition: r.readUInt8(),
			vertexIndexSize: r.readUInt8(),
			textureIndexSize: r.readUInt8(),
			materialIndexSize: r.readUInt8(),
			boneIndexSize: r.readUInt8(),
			morphIndexSize: r.readUInt8(),
			rigidBodyIndexSize: r.readUInt8(),
			modelName: "",
			modelNameEn: "",
			comment: "",
			commentEn: ""
		};
		this.header.modelName = this.readTextBuf();
		this.header.modelNameEn = this.readTextBuf();
		this.header.comment = this.readTextBuf();
		this.header.commentEn = this.readTextBuf();
	}

	private readBoneIndex()
	{
		switch (this.header.boneIndexSize) {
			case 1:
				return this.reader.readInt8();
				break;
			case 2:
				return this.reader.readInt16();
				break;
			case 4:
				return this.reader.readInt32();
				break;
		}
	}

	private loadVerticies() {
		var r = this.reader;
		debugger;
		var count = r.readInt32();
		var uvCount = this.header.uvAddition;
		//allocate arrays
		var additionalUvs = new Array(uvCount);
		for (var i = 0; i < uvCount; i++) {
			additionalUvs[i] = new Array(count * 4);
		}
		var result: PMXVerticies = {
			positions: new Array(count * 3),
			normals: new Array(count * 3),
			uvs: new Array(count * 2),
			additionalUV: additionalUvs,
			edgeScaling: new Array(count),
			verticies: new Array(count)
		};
		for (var i = 0; i < count; i++) {
			result.positions[3 * i + 0] = r.readFloat();
			result.positions[3 * i + 1] = r.readFloat();
			result.positions[3 * i + 2] = r.readFloat();
			result.normals[3 * i + 0] = r.readFloat();
			result.normals[3 * i + 1] = r.readFloat();
			result.normals[3 * i + 2] = r.readFloat();
			result.uvs[2 * i + 0] = r.readFloat();
			result.uvs[2 * i + 1] = r.readFloat();
			for (var j = 0; j < uvCount; j++) {
				result.additionalUV[j][4 * i + 0] = r.readFloat();
				result.additionalUV[j][4 * i + 1] = r.readFloat();
				result.additionalUV[j][4 * i + 2] = r.readFloat();
				result.additionalUV[j][4 * i + 3] = r.readFloat();
			}
			result.verticies[i] = { weightTransform: r.readUInt8() }
			switch (result.verticies[i].weightTransform) {
				case 0://BDEF
					result.verticies[i].bdef1 = { boneIndex: this.readBoneIndex() }
					break;
				case 1://BDEF2
					result.verticies[i].bdef2 =
					{
						boneIndex1: this.readBoneIndex(),
						boneIndex2: this.readBoneIndex(),
						boneWeight: r.readFloat()
					}
					break;
				case 2://BDEF4
					result.verticies[i].bdef4 = {
						boneIndex1: this.readBoneIndex(),
						boneIndex2: this.readBoneIndex(),
						boneIndex3: this.readBoneIndex(),
						boneIndex4: this.readBoneIndex(),
						boneWeight1: r.readFloat(),
						boneWeight2: r.readFloat(),
						boneWeight3: r.readFloat(),
						boneWeight4: r.readFloat(),
					}
					break;
				case 3://SDEF
					result.verticies[i].sdef =
					{
						boneIndex1: this.readBoneIndex(),
						boneIndex2: this.readBoneIndex(),
						boneWeight: r.readFloat(),
						boneParams: [
							r.readFloat(),
							r.readFloat(),
							r.readFloat(),
							r.readFloat(),
							r.readFloat(),
							r.readFloat(),
							r.readFloat(),
							r.readFloat(),
							r.readFloat(),
						]
					}
					break;
			}
			result.edgeScaling[i] = r.readFloat()
		}
		this.verticies = result;
	}
}

export = PMX;