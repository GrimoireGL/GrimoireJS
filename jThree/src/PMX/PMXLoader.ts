import PMXHeader = require("./PMXHeader");
import PMXVerticies = require("./PMXVerticies");
import PMXMaterial = require("./PMXMaterial");
import PMXBone = require("./PMXBone");
import PMXMorph = require("./PMXMorph");
import PMXDisplayFrame = require("./PMXDisplayFrame");
import PMXRigidBody = require("./PMXRigidBody");
import PMXJoint = require("./PMXJoint");
import ImageLoader = require("../Core/Resources/ImageLoader");
class PMX {
  private reader: DataView;

  private header: PMXHeader;

  private verticies: PMXVerticies;

  private surfaces: number[];

  private textures: string[];

  private materials: PMXMaterial[];

  private bones: PMXBone[];

  private morphs: PMXMorph[];

  private displayFrames: PMXDisplayFrame[];

  private rigidBodies: PMXRigidBody[];

  private joints: PMXJoint[];

  private _resourceDirectory: string;

  private _offset: number = 0;

  public get Header() {
    return this.header;
  }

  public get Verticies() {
    return this.verticies;
  }

  public get Surfaces() {
    return this.surfaces;
  }

  public get Materials() {
    return this.materials;
  }

  public get Textures() {
    return this.textures;
  }

  public get Bones() {
    return this.bones;
  }

  public get Morphs() {
    return this.morphs;
  }

  constructor(data: ArrayBuffer, resourceDirectory: string) {
    this._resourceDirectory = resourceDirectory;
    this.reader = new DataView(data, 0, data.byteLength);
    this.loadHeader();
    this.loadVerticies();
    this.loadSurfaces();
    this.loadTextures();
    this.loadMaterials();
    this.loadBones();
    this.loadMorphs();
    this.loadDisplayFrames();
    this.loadRigidBodies();
    this.loadJoints();
  }

  private readTextBuf(): string {
    const length = this._readInt32();
    if (this.header.encoding === 0) {
      // When this was UTF-16LE
      const textArr = [];
      for (let i = 0; i < length / 2; i++) {
        const c = this._readInt16();
        if (c === 0) {
          continue; //  To discard null char
        }
        textArr.push(c);
      }
      return String.fromCharCode.apply(null, textArr);
    }
    return this._readUTF8String(length);
  }

  private loadHeader() {
    this._readUint32(); // pass magic
    this.header = {
      version: this._readFloat32(),
      headerByteSize: this._readUint8(),
      encoding: this._readUint8(),
      uvAddition: this._readUint8(),
      vertexIndexSize: this._readUint8(),
      textureIndexSize: this._readUint8(),
      materialIndexSize: this._readUint8(),
      boneIndexSize: this._readUint8(),
      morphIndexSize: this._readUint8(),
      rigidBodyIndexSize: this._readUint8(),
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

  private readMorphIndex() {
    return this.readIndexExceptVertex(this.header.morphIndexSize);
  }

  private readMaterialIndex() {
    return this.readIndexExceptVertex(this.header.materialIndexSize);
  }

  private readRigidBodyIndex() {
    return this.readIndexExceptVertex(this.header.rigidBodyIndexSize);
  }
  private readVertexIndex() {
    switch (this.header.vertexIndexSize) {
      case 1:
        return this._readUint8();
      case 2:
        return this._readUint16();
      case 4:
        return this._readInt32();
    }
  }

  private readIndexExceptVertex(byte: number) {
    switch (byte) {
      case 1:
        return this._readInt8();
      case 2:
        return this._readInt16();
      case 4:
        return this._readInt32();
    }
  }

  private loadVerticies() {
    const count = this._readInt32();
    const uvCount = this.header.uvAddition;
    // allocate arrays
    const additionalUvs = new Array(uvCount);
    for (let i = 0; i < uvCount; i++) {
      additionalUvs[i] = new Array(count * 4);
    }
    let bi1 = 0, bi2 = 0, bi3 = 0, bi4 = 0;
    let bw1 = 0, bw2 = 0, bw3 = 0, bw4 = 0;
    let sumCache = 0;
    const result: PMXVerticies = {
      positions: new Array(count * 3),
      normals: new Float32Array(count * 3),
      uvs: new Array(count * 2),
      additionalUV: additionalUvs,
      edgeScaling: new Float32Array(count),
      verticies: new Array(count),
      boneIndicies: new Float32Array(count * 4),
      boneWeights: new Float32Array(count * 4)
    };
    for (let i = 0; i < count; i++) {
      bi1 = 0; bi2 = 0; bi3 = 0; bi4 = 0;
      bw1 = 0; bw2 = 0; bw3 = 0; bw4 = 0;
      result.positions[3 * i + 0] = this._readFloat32();
      result.positions[3 * i + 1] = this._readFloat32();
      result.positions[3 * i + 2] = -this._readFloat32();
      result.normals[3 * i + 0] = this._readFloat32();
      result.normals[3 * i + 1] = this._readFloat32();
      result.normals[3 * i + 2] = -this._readFloat32();
      result.uvs[2 * i + 0] = this._readFloat32();
      result.uvs[2 * i + 1] = this._readFloat32();
      for (let j = 0; j < uvCount; j++) {
        result.additionalUV[j][4 * i + 0] = this._readFloat32();
        result.additionalUV[j][4 * i + 1] = this._readFloat32();
        result.additionalUV[j][4 * i + 2] = this._readFloat32();
        result.additionalUV[j][4 * i + 3] = this._readFloat32();
      }
      result.verticies[i] = { weightTransform: this._readUint8() };
      switch (result.verticies[i].weightTransform) {
        case 0: // BDEF
          bi1 = this.readBoneIndex();
          bw1 = 1;
          break;
        case 1: // BDEF2
          bi1 = this.readBoneIndex();
          bi2 = this.readBoneIndex();
          bw1 = this._readFloat32();
          bw2 = 1 - bw1;
          break;
        case 2: // BDEF4
          bi1 = this.readBoneIndex();
          bi2 = this.readBoneIndex();
          bi3 = this.readBoneIndex();
          bi4 = this.readBoneIndex();
          bw1 = this._readFloat32();
          bw2 = this._readFloat32();
          bw3 = this._readFloat32();
          bw4 = this._readFloat32();
          sumCache = bw1 + bw2 + bw3 + bw4;
          bw1 /= sumCache;
          bw2 /= sumCache;
          bw3 /= sumCache;
          bw4 /= sumCache;
          break;
        case 3: // SDEF
          bi1 = this.readBoneIndex();
          bi2 = this.readBoneIndex();
          bw1 = this._readFloat32();
          bw2 = 1 - bw1;
          result.verticies[i].sdef = {
            boneParams: [
              this._readFloat32(),
              this._readFloat32(),
              this._readFloat32(),
              this._readFloat32(),
              this._readFloat32(),
              this._readFloat32(),
              this._readFloat32(),
              this._readFloat32(),
              this._readFloat32(),
            ]
          };
          break;
      }
      result.boneIndicies[4 * i + 0] = bi1;
      result.boneIndicies[4 * i + 1] = bi2;
      result.boneIndicies[4 * i + 2] = bi3;
      result.boneIndicies[4 * i + 3] = bi4;
      result.boneWeights[4 * i + 0] = bw1;
      result.boneWeights[4 * i + 1] = bw2;
      result.boneWeights[4 * i + 2] = bw3;
      result.boneWeights[4 * i + 3] = bw4;
      result.edgeScaling[i] = this._readFloat32();
    }
    this.verticies = result;
  }

  private loadSurfaces() {
    const count = this._readInt32();
    this.surfaces = new Array(count);
    for (let i = 0; i < count / 3; i++) {
      this.surfaces[3 * i + 0] = this.readVertexIndex();
      this.surfaces[3 * i + 2] = this.readVertexIndex();
      this.surfaces[3 * i + 1] = this.readVertexIndex();
    }
  }

  private loadTextures() {
    const count = this._readInt32();
    this.textures = new Array(count);
    for (let i = 0; i < count; i++) {
      this.textures[i] = this.readTextBuf().replace("\\", "/");
      ImageLoader.loadImage(this._resourceDirectory + this.textures[i]);
    }
  }

  private loadMaterials() {
    const count = this._readInt32();
    this.materials = new Array(count);
    let cache = 0;
    for (let i = 0; i < count; i++) {
      this.materials[i] = {
        materialName: this.readTextBuf(),
        materialNameEn: this.readTextBuf(),
        diffuse: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
        specular: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
        ambient: [this._readFloat32(), this._readFloat32(), this._readFloat32()],
        drawFlag: this._readUint8(),
        edgeColor: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
        edgeSize: this._readFloat32(),
        textureIndex: this.readTextureIndex(),
        sphereTextureIndex: this.readTextureIndex(),
        sphereMode: this._readUint8(),
        sharedToonFlag: cache = this._readUint8(),
        targetToonIndex: cache === 0 ? this.readTextureIndex() : this._readUint8(),
        memo: this.readTextBuf(),
        vertexCount: this._readInt32(),
      };
    }
  }

  private loadBones() {
    const count = this._readUint32();
    this.bones = new Array(count);
    let boneFlagCache = 0;
    let ikLinkCountCache = 0;
    let ikLimitedCache = 0;
    for (let i = 0; i < count; i++) {
      this.bones[i] = {
        boneName: this.readTextBuf(),
        boneNameEn: this.readTextBuf(),
        position: [this._readFloat32(), this._readFloat32(), -this._readFloat32()],
        parentBoneIndex: this.readBoneIndex(),
        transformLayer: this._readInt32(),
        boneFlag: boneFlagCache = this._readUint16(),
        positionOffset: (boneFlagCache & 0x0001) === 0 ? [this._readFloat32(), this._readFloat32(), -this._readFloat32()] : undefined,
        connectingBoneIndex: (boneFlagCache & 0x0001) > 0 ? this.readBoneIndex() : undefined,
        providingBoneIndex: (boneFlagCache & 0x0100) > 0 || (boneFlagCache & 0x0200) > 0 ? this.readBoneIndex() : undefined,
        providingRate: (boneFlagCache & 0x0100) > 0 || (boneFlagCache & 0x0200) > 0 ? this._readFloat32() : undefined,
        fixedAxis: (boneFlagCache & 0x0400) > 0 ? [this._readFloat32(), this._readFloat32(), -this._readFloat32()] : undefined,
        localAxisX: (boneFlagCache & 0x0800) > 0 ? [this._readFloat32(), this._readFloat32(), - this._readFloat32()] : undefined,
        localAxisZ: (boneFlagCache & 0x0800) > 0 ? [this._readFloat32(), this._readFloat32(), -this._readFloat32()] : undefined,
        externalParentTransformKey: (boneFlagCache & 0x2000) > 0 ? this._readInt32() : undefined,
        ikTargetBoneIndex: (boneFlagCache & 0x0020) > 0 ? this.readBoneIndex() : undefined,
        ikLoopCount: (boneFlagCache & 0x0020) > 0 ? this._readInt32() : undefined,
        ikLimitedRotation: (boneFlagCache & 0x0020) > 0 ? this._readFloat32() : undefined,
        ikLinkCount: (boneFlagCache & 0x0020) > 0 ? ikLinkCountCache = this._readInt32() : ikLinkCountCache = undefined,
        ikLinks: (boneFlagCache & 0x0020) > 0 ? new Array(ikLinkCountCache) : undefined
      };
      if (ikLinkCountCache) {
        for (let j = 0; j < ikLinkCountCache; j++) {
          this.bones[i].ikLinks[j] = {
            ikLinkBoneIndex: this.readBoneIndex(),
            isLimitedRotation: ikLimitedCache = this._readUint8(),
            limitedRotation: ikLimitedCache > 0 ? [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()] : undefined
          };
        }
      }
    }
  }
  private loadMorphs() {
    const count = this._readInt32();
    this.morphs = new Array(count);
    let morphCountCache = 0;
    for (let i = 0; i < count; i++) {
      this.morphs[i] = {
        morphName: this.readTextBuf(),
        morphNameEn: this.readTextBuf(),
        editPanel: this._readUint8(),
        morphKind: this._readUint8(),
        morphOffsetCount: morphCountCache = this._readInt32()
      };
      switch (this.morphs[i].morphKind) {
        case 0:
          // group morph
          this.morphs[i].groupMorph = new Array(morphCountCache);
          for (let j = 0; j < morphCountCache; j++) {
            this.morphs[i].groupMorph[j] = {
              morphIndex: this.readMorphIndex(),
              morphRate: this._readFloat32()
            };
          }
          break;
        case 1:
          this.morphs[i].vertexMorph = new Array(morphCountCache);
          for (let j = 0; j < morphCountCache; j++) {
            this.morphs[i].vertexMorph[j] = {
              vertexIndex: this.readVertexIndex(),
              vertexOffset: [this._readFloat32(), this._readFloat32(), -this._readFloat32()]
            };
          }
          break;
        case 2:
          this.morphs[i].boneMorph = new Array(morphCountCache);
          for (let j = 0; j < morphCountCache; j++) {
            this.morphs[i].boneMorph[j]
            = {
              boneIndex: this.readBoneIndex(),
              translationOffset: [this._readFloat32(), this._readFloat32(), -this._readFloat32()],
              rotationOffset: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()]
            };
          }
          break;
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          this.morphs[i].uvMorph = new Array(morphCountCache);
          for (let j = 0; j < morphCountCache; j++) {
            this.morphs[i].uvMorph[j]
            = {
              vertexIndex: this.readVertexIndex(),
              uvOffset: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()]
            };
          }
          break;
        case 8:
          this.morphs[i].materialMorph = new Array(morphCountCache);
          for (let j = 0; j < morphCountCache; j++) {
            this.morphs[i].materialMorph[j]
            = {
              materialIndex: this.readMaterialIndex(),
              operationType: this._readUint8(),
              diffuse: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
              specular: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
              ambient: [this._readFloat32(), this._readFloat32(), this._readFloat32()],
              edgeColor: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
              edgeSize: this._readFloat32(),
              textureCoefficient: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
              sphereTextureCoefficient: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
              toonTextureCoefficient: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()]
            };
          }
          break;
      }
    }
  }

  private loadDisplayFrames() {
    const count = this._readInt32();
    this.displayFrames = new Array(count);
    let countCache = 0;
    let targetCache = 0;
    for (let i = 0; i < count; i++) {
      this.displayFrames[i] = {
        frameName: this.readTextBuf(),
        frameNameEn: this.readTextBuf(),
        specialFrameFlag: this._readUint8(),
        elementCount: countCache = this._readInt32(),
        targetElementTypes: new Array(countCache),
        targetIndex: new Array(countCache)
      };
      for (let j = 0; j < countCache; j++) {
        this.displayFrames[i].targetElementTypes[j] = targetCache = this._readUint8();
        this.displayFrames[i].targetIndex[j] = targetCache > 0 ? this.readMorphIndex() : this.readBoneIndex();
      }
    }
  }

  private loadRigidBodies() {
    const count = this._readInt32();
    this.rigidBodies = new Array(count);
    for (let i = 0; i < count; i++) {
      this.rigidBodies[i] = {
        rigidBodyName: this.readTextBuf(),
        rigidBodyNameEn: this.readTextBuf(),
        boneIndex: this.readBoneIndex(),
        group: this._readUint8(),
        unCollisionGroupFlag: this._readUint16(),
        shape: this._readUint8(),
        size: [this._readFloat32(), this._readFloat32(), this._readFloat32()],
        position: [this._readFloat32(), this._readFloat32(), -this._readFloat32()],
        rotation: [this._readFloat32(), this._readFloat32(), this._readFloat32()],
        mass: this._readFloat32(),
        translationFraction: this._readFloat32(),
        rotationFraction: this._readFloat32(),
        boundness: this._readFloat32(),
        fraction: this._readFloat32(),
        calcType: this._readUint8(),
      };
    }
  }

  private loadJoints() {
    const count = this._readInt32();
    this.joints = new Array(count);
    let typeCache = 0;
    for (let i = 0; i < count; i++) {
      this.joints[i] = {
        jointName: this.readTextBuf(),
        jointNameEn: this.readTextBuf(),
        jointType: typeCache = this._readUint8(),
        spring: typeCache === 0 ?
          {
            targetRigidBody1: this.readRigidBodyIndex(),
            targetRigidBody2: this.readRigidBodyIndex(),
            position: [this._readFloat32(), this._readFloat32(), this._readFloat32()],
            rotation: [this._readFloat32(), this._readFloat32(), this._readFloat32()],
            translationLimit: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
            rotationLimit: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
            springCoefficientLimit: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()]
          } : undefined
      };
    }
  }

  private _readUTF8String(length: number): string {
    const utf16 = new ArrayBuffer(length * 2);
    const utf16View = new Uint16Array(utf16);
    for (let i = 0; i < length; ++i) {
      utf16View[i] = this._readUint8();
    }
    return String.fromCharCode.apply(null, utf16View);
  }

  private _readUint8(): number {
    const result = this.reader.getUint8(this._offset);
    this._offset += 1;
    return result;
  }

  private _readUint16(): number {
    const result = this.reader.getUint16(this._offset, true);
    this._offset += 2;
    return result;
  }

  private _readUint32(): number {
    const result = this.reader.getUint32(this._offset, true);
    this._offset += 4;
    return result;
  }

  private _readInt8(): number {
    const result = this.reader.getInt8(this._offset);
    this._offset += 1;
    return result;
  }

  private _readInt16(): number {
    const result = this.reader.getInt16(this._offset, true);
    this._offset += 2;
    return result;
  }

  private _readInt32(): number {
    const result = this.reader.getInt32(this._offset, true);
    this._offset += 4;
    return result;
  }

  private _readFloat32(): number {
    const result = this.reader.getFloat32(this._offset, true);
    this._offset += 4;
    return result;
  }
}

export = PMX;
