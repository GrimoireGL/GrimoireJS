import PMXHeader = require('./PMXHeader');
import PMXVerticies = require('./PMXVerticies');
import PMXMaterial = require('./PMXMaterial');
import PMXBone = require('./PMXBone');
class PMX {
	private reader: jDataView;

	private header: PMXHeader;

	private verticies: PMXVerticies;

	private surfaces: number[];

	private textures: string[];

	private materials: PMXMaterial[];

	private bones: PMXBone[];

	constructor(data: ArrayBuffer) {
		this.reader = new jDataView(data, 0, data.byteLength, true);
		this.loadHeader();
		this.loadVerticies();
		this.loadSurfaces();
		this.loadTextures();
		this.loadMaterials();
		this.loadBones();
	}

	private readTextBuf(): string {
		var length = this.reader.getInt32();
		return this.reader.getString(length);
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
		this.reader.getUint32();//pass magic
		this.header =
		{
			version: r.getFloat32(),
			headerByteSize: r.getUint8(),
			encoding: r.getUint8(),
			uvAddition: r.getUint8(),
			vertexIndexSize: r.getUint8(),
			textureIndexSize: r.getUint8(),
			materialIndexSize: r.getUint8(),
			boneIndexSize: r.getUint8(),
			morphIndexSize: r.getUint8(),
			rigidBodyIndexSize: r.getUint8(),
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

	private readBoneIndex() {
		return this.readIndexExceptVertex(this.header.boneIndexSize);
	}

	private readTextureIndex() {
		return this.readIndexExceptVertex(this.header.textureIndexSize);
	}
	private readVertexIndex() {
		switch (this.header.vertexIndexSize) {
			case 1:
				return this.reader.getUint8();
				break;
			case 2:
				return this.reader.getUint16();
				break;
			case 4:
				return this.reader.getInt32();
				break;
		}
	}

	private readIndexExceptVertex(byte: number) {
		switch (byte) {
			case 1:
				return this.reader.getInt8();
				break;
			case 2:
				return this.reader.getInt16();
				break;
			case 4:
				return this.reader.getInt32();
				break;
		}
	}

	private loadVerticies() {
		var r = this.reader;
		debugger;
		var count = r.getInt32();
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
			result.positions[3 * i + 0] = r.getFloat32();
			result.positions[3 * i + 1] = r.getFloat32();
			result.positions[3 * i + 2] = r.getFloat32();
			result.normals[3 * i + 0] = r.getFloat32();
			result.normals[3 * i + 1] = r.getFloat32();
			result.normals[3 * i + 2] = r.getFloat32();
			result.uvs[2 * i + 0] = r.getFloat32();
			result.uvs[2 * i + 1] = r.getFloat32();
			for (var j = 0; j < uvCount; j++) {
				result.additionalUV[j][4 * i + 0] = r.getFloat32();
				result.additionalUV[j][4 * i + 1] = r.getFloat32();
				result.additionalUV[j][4 * i + 2] = r.getFloat32();
				result.additionalUV[j][4 * i + 3] = r.getFloat32();
			}
			result.verticies[i] = { weightTransform: r.getUint8() }
			switch (result.verticies[i].weightTransform) {
				case 0://BDEF
					result.verticies[i].bdef1 = { boneIndex: this.readBoneIndex() }
					break;
				case 1://BDEF2
					result.verticies[i].bdef2 =
					{
						boneIndex1: this.readBoneIndex(),
						boneIndex2: this.readBoneIndex(),
						boneWeight: r.getFloat32()
					}
					break;
				case 2://BDEF4
					result.verticies[i].bdef4 = {
						boneIndex1: this.readBoneIndex(),
						boneIndex2: this.readBoneIndex(),
						boneIndex3: this.readBoneIndex(),
						boneIndex4: this.readBoneIndex(),
						boneWeight1: r.getFloat32(),
						boneWeight2: r.getFloat32(),
						boneWeight3: r.getFloat32(),
						boneWeight4: r.getFloat32(),
					}
					break;
				case 3://SDEF
					result.verticies[i].sdef =
					{
						boneIndex1: this.readBoneIndex(),
						boneIndex2: this.readBoneIndex(),
						boneWeight: r.getFloat32(),
						boneParams: [
							r.getFloat32(),
							r.getFloat32(),
							r.getFloat32(),
							r.getFloat32(),
							r.getFloat32(),
							r.getFloat32(),
							r.getFloat32(),
							r.getFloat32(),
							r.getFloat32(),
						]
					}
					break;
			}
			result.edgeScaling[i] = r.getFloat32()
		}
		this.verticies = result;
	}

	private loadSurfaces() {
		var r = this.reader;
		var count = r.getInt32();
		this.surfaces = new Array(count);
		for (var i = 0; i < count; i++) {
			this.surfaces[i] = this.readVertexIndex();
		}
	}

	private loadTextures() {
		var r = this.reader;
		var count = r.getInt32();
		this.textures = new Array(count);
		for (var i = 0; i < count; i++) {
			this.textures[i] = this.readTextBuf();
		}
	}

	private loadMaterials() {
		var r = this.reader;
		var count = r.getInt32();
		this.materials = new Array(count);
		var cache = 0;
		for (var i = 0; i < count; i++) {
			this.materials[i] = {
				materialName: this.readTextBuf(),
				materialNameEn: this.readTextBuf(),
				diffuse: [r.getFloat32(), r.getFloat32(), r.getFloat32(), r.getFloat32()],
				specular: [r.getFloat32(), r.getFloat32(), r.getFloat32(), r.getFloat32()],
				ambient: [r.getFloat32(), r.getFloat32(), r.getFloat32()],
				drawFlag: r.getUint8(),
				edgeColor: [r.getFloat32(), r.getFloat32(), r.getFloat32(), r.getFloat32()],
				edgeSize: r.getFloat32(),
				textureIndex: this.readTextureIndex(),
				sphereTextureIndex: this.readTextureIndex(),
				sphereMode: r.getUint8(),
				sharedToonFlag: cache = r.getUint8(),
				targetToonIndex: cache == 0 ? this.readTextureIndex() : r.getUint8(),
				memo: this.readTextBuf(),
				vertexCount: r.getInt32(),
			};
		}
	}

	private loadBones() {
		var r = this.reader;
		var count = r.getUint32();
		this.bones = new Array(count);
		var boneFlagCache = 0;
		var ikLinkCountCache = 0;
		var ikLimitedCache = 0;
		for (var i = 0; i < count; i++) {
			this.bones[i] = {
				boneName: this.readTextBuf(),
				boneNameEn: this.readTextBuf(),
				position: [r.getFloat32(), r.getFloat32(), r.getFloat32()],
				parentBoneIndex: this.readBoneIndex(),
				transformLayer: r.getInt32(),
				boneFlag: boneFlagCache = r.getUint16(),
				positionOffset: (boneFlagCache & 0x0001) == 0 ? [r.getFloat32(), r.getFloat32(), r.getFloat32()] : undefined,
				connectingBoneIndex: (boneFlagCache & 0x0001) > 0 ? this.readBoneIndex() : undefined,
				providingBoneIndex: (boneFlagCache & 0x0100) > 0 || (boneFlagCache & 0x0200) > 0 ? this.readBoneIndex() : undefined,
				providingRate: (boneFlagCache & 0x0100) > 0 || (boneFlagCache & 0x0200) > 0 ? r.getFloat32() : undefined,
				fixedAxis: (boneFlagCache & 0x0400) > 0 ?[r.getFloat32(),r.getFloat32(),r.getFloat32()]:undefined,
				localAxisX:(boneFlagCache&0x0800)>0?[r.getFloat32(),r.getFloat32(),r.getFloat32()]:undefined,
				localAxisZ:(boneFlagCache&0x0800)>0?[r.getFloat32(),r.getFloat32(),r.getFloat32()]:undefined,
				externalParentTransformKey:(boneFlagCache&0x2000)>0?r.getInt32():undefined,
				ikTargetBoneIndex:(boneFlagCache&0x0020)>0?this.readBoneIndex():undefined,
				ikLoopCount:(boneFlagCache&0x0020)>0?r.getInt32():undefined,
				ikLimitedRotation:(boneFlagCache&0x0020)>0?r.getFloat32():undefined,
				ikLinkCount:(boneFlagCache&0x0020)>0?ikLinkCountCache=r.getInt32():ikLinkCountCache=undefined,
				ikLinks:(boneFlagCache&0x0020)>0?new Array(ikLinkCountCache):undefined
			};
			if(ikLinkCountCache)
				for (var j = 0; j < ikLinkCountCache;j++)
				{
					this.bones[i].ikLinks[j]={
						ikLinkBoneIndex:this.readBoneIndex(),
						isLimitedRotation:ikLimitedCache=r.getUint8(),
						limitedRotation:ikLimitedCache>0?[r.getFloat32(),r.getFloat32(),r.getFloat32(),r.getFloat32(),r.getFloat32(),r.getFloat32()]:undefined
					}
				}
		}
	}
}

export = PMX;