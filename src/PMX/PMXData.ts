import PMXHeader from "./PMXHeaderData";
import PMXVerticies from "./PMXVerticiesData";
import PMXMaterial from "./PMXMaterialData";
import PMXBone from "./PMXBoneData";
import PMXMorph from "./PMXMorphData";
import PMXDisplayFrame from "./PMXDisplayFrameData";
import PMXRigidBody from "./PMXRigidBodyData";
import PMXJoint from "./PMXJointData";
import ImageLoader from "../Core/Resources/ImageLoader";
class PMXData {
  private _reader: DataView;

  private _header: PMXHeader;

  private _verticies: PMXVerticies;

  private _surfaces: number[];

  private _textures: string[];

  private _materials: PMXMaterial[];

  private _bones: PMXBone[];

  private _morphs: PMXMorph[];

  private _displayFrames: PMXDisplayFrame[];

  private _rigidBodies: PMXRigidBody[];

  private _joints: PMXJoint[];

  private _resourceDirectory: string;

  private _offset: number = 0;

  public get Header() {
    return this._header;
  }

  public get Verticies() {
    return this._verticies;
  }

  public get Surfaces() {
    return this._surfaces;
  }

  public get Materials() {
    return this._materials;
  }

  public get Textures() {
    return this._textures;
  }

  public get Bones() {
    return this._bones;
  }

  public get Morphs() {
    return this._morphs;
  }

  constructor(data: ArrayBuffer, resourceDirectory: string) {
    this._resourceDirectory = resourceDirectory;
    this._reader = new DataView(data, 0, data.byteLength);
    this._loadHeader();
    this._loadVerticies();
    this._loadSurfaces();
    this._loadTextures();
    this._loadMaterials();
    this._loadBones();
    this._loadMorphs();
    this._loadDisplayFrames();
    this._loadRigidBodies();
    this._loadJoints();
  }

  private _readTextBuffer(): string {
    const length = this._readInt32();
    if (this._header.encoding === 0) {
      return this._readUTF16LEString(length);
    }
    return this._readUTF8String(length);
  }

  private _loadHeader(): void {
    this._readUint32(); // pass magic
    this._header = {
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
    this._header.modelName = this._readTextBuffer();
    this._header.modelNameEn = this._readTextBuffer();
    this._header.comment = this._readTextBuffer();
    this._header.commentEn = this._readTextBuffer();
  }

  private _readBoneIndex(): number {
    return this._readIndexExceptVertex(this._header.boneIndexSize);
  }

  private _readTextureIndex(): number {
    return this._readIndexExceptVertex(this._header.textureIndexSize);
  }

  private _readMorphIndex(): number {
    return this._readIndexExceptVertex(this._header.morphIndexSize);
  }

  private _readMaterialIndex(): number {
    return this._readIndexExceptVertex(this._header.materialIndexSize);
  }

  private _readRegidBodyIndex(): number {
    return this._readIndexExceptVertex(this._header.rigidBodyIndexSize);
  }
  private _readVertexIndex(): number {
    switch (this._header.vertexIndexSize) {
      case 1:
        return this._readUint8();
      case 2:
        return this._readUint16();
      case 4:
        return this._readInt32();
    }
  }

  private _readIndexExceptVertex(byte: number): number {
    switch (byte) {
      case 1:
        return this._readInt8();
      case 2:
        return this._readInt16();
      case 4:
        return this._readInt32();
    }
  }

  private _loadVerticies(): void {
    const count = this._readInt32();
    const uvCount = this._header.uvAddition;
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
          bi1 = this._readBoneIndex();
          bw1 = 1;
          break;
        case 1: // BDEF2
          bi1 = this._readBoneIndex();
          bi2 = this._readBoneIndex();
          bw1 = this._readFloat32();
          bw2 = 1 - bw1;
          break;
        case 2: // BDEF4
          bi1 = this._readBoneIndex();
          bi2 = this._readBoneIndex();
          bi3 = this._readBoneIndex();
          bi4 = this._readBoneIndex();
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
          bi1 = this._readBoneIndex();
          bi2 = this._readBoneIndex();
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
    this._verticies = result;
  }

  private _loadSurfaces(): void {
    const count = this._readInt32();
    this._surfaces = new Array(count);
    for (let i = 0; i < count / 3; i++) {
      this._surfaces[3 * i + 0] = this._readVertexIndex();
      this._surfaces[3 * i + 2] = this._readVertexIndex();
      this._surfaces[3 * i + 1] = this._readVertexIndex();
    }
  }

  private _loadTextures(): void {
    const count = this._readInt32();
    this._textures = new Array(count);
    for (let i = 0; i < count; i++) {
      this._textures[i] = this._readTextBuffer().replace("\\", "/");
      ImageLoader.loadImage(this._resourceDirectory + this._textures[i]);
    }
  }

  private _loadMaterials(): void {
    const count = this._readInt32();
    this._materials = new Array(count);
    let cache = 0;
    for (let i = 0; i < count; i++) {
      this._materials[i] = {
        materialName: this._readTextBuffer(),
        materialNameEn: this._readTextBuffer(),
        diffuse: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
        specular: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
        ambient: [this._readFloat32(), this._readFloat32(), this._readFloat32()],
        drawFlag: this._readUint8(),
        edgeColor: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
        edgeSize: this._readFloat32(),
        textureIndex: this._readTextureIndex(),
        sphereTextureIndex: this._readTextureIndex(),
        sphereMode: this._readUint8(),
        sharedToonFlag: cache = this._readUint8(),
        targetToonIndex: cache === 0 ? this._readTextureIndex() : this._readUint8(),
        memo: this._readTextBuffer(),
        vertexCount: this._readInt32(),
      };
    }
  }

  private _loadBones(): void {
    const count = this._readUint32();
    this._bones = new Array(count);
    let boneFlagCache = 0;
    let ikLinkCountCache = 0;
    let ikLimitedCache = 0;
    for (let i = 0; i < count; i++) {
      this._bones[i] = {
        boneName: this._readTextBuffer(),
        boneNameEn: this._readTextBuffer(),
        position: [this._readFloat32(), this._readFloat32(), -this._readFloat32()],
        parentBoneIndex: this._readBoneIndex(),
        transformLayer: this._readInt32(),
        boneFlag: boneFlagCache = this._readUint16(),
        positionOffset: (boneFlagCache & 0x0001) === 0 ? [this._readFloat32(), this._readFloat32(), -this._readFloat32()] : undefined,
        connectingBoneIndex: (boneFlagCache & 0x0001) > 0 ? this._readBoneIndex() : undefined,
        providingBoneIndex: (boneFlagCache & 0x0100) > 0 || (boneFlagCache & 0x0200) > 0 ? this._readBoneIndex() : undefined,
        providingRate: (boneFlagCache & 0x0100) > 0 || (boneFlagCache & 0x0200) > 0 ? this._readFloat32() : undefined,
        fixedAxis: (boneFlagCache & 0x0400) > 0 ? [this._readFloat32(), this._readFloat32(), -this._readFloat32()] : undefined,
        localAxisX: (boneFlagCache & 0x0800) > 0 ? [this._readFloat32(), this._readFloat32(), - this._readFloat32()] : undefined,
        localAxisZ: (boneFlagCache & 0x0800) > 0 ? [this._readFloat32(), this._readFloat32(), -this._readFloat32()] : undefined,
        externalParentTransformKey: (boneFlagCache & 0x2000) > 0 ? this._readInt32() : undefined,
        ikTargetBoneIndex: (boneFlagCache & 0x0020) > 0 ? this._readBoneIndex() : undefined,
        ikLoopCount: (boneFlagCache & 0x0020) > 0 ? this._readInt32() : undefined,
        ikLimitedRotation: (boneFlagCache & 0x0020) > 0 ? this._readFloat32() : undefined,
        ikLinkCount: (boneFlagCache & 0x0020) > 0 ? ikLinkCountCache = this._readInt32() : ikLinkCountCache = undefined,
        ikLinks: (boneFlagCache & 0x0020) > 0 ? new Array(ikLinkCountCache) : undefined
      };
      if (ikLinkCountCache) {
        for (let j = 0; j < ikLinkCountCache; j++) {
          this._bones[i].ikLinks[j] = {
            ikLinkBoneIndex: this._readBoneIndex(),
            isLimitedRotation: ikLimitedCache = this._readUint8(),
            limitedRotation: ikLimitedCache > 0 ? [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()] : undefined
          };
        }
      }
    }
  }
  private _loadMorphs(): void {
    const count = this._readInt32();
    this._morphs = new Array(count);
    let morphCountCache = 0;
    for (let i = 0; i < count; i++) {
      this._morphs[i] = {
        morphName: this._readTextBuffer(),
        morphNameEn: this._readTextBuffer(),
        editPanel: this._readUint8(),
        morphKind: this._readUint8(),
        morphOffsetCount: morphCountCache = this._readInt32()
      };
      switch (this._morphs[i].morphKind) {
        case 0:
          // group morph
          this._morphs[i].groupMorph = new Array(morphCountCache);
          for (let j = 0; j < morphCountCache; j++) {
            this._morphs[i].groupMorph[j] = {
              morphIndex: this._readMorphIndex(),
              morphRate: this._readFloat32()
            };
          }
          break;
        case 1:
          this._morphs[i].vertexMorph = new Array(morphCountCache);
          for (let j = 0; j < morphCountCache; j++) {
            this._morphs[i].vertexMorph[j] = {
              vertexIndex: this._readVertexIndex(),
              vertexOffset: [this._readFloat32(), this._readFloat32(), -this._readFloat32()]
            };
          }
          break;
        case 2:
          this._morphs[i].boneMorph = new Array(morphCountCache);
          for (let j = 0; j < morphCountCache; j++) {
            this._morphs[i].boneMorph[j]
            = {
              boneIndex: this._readBoneIndex(),
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
          this._morphs[i].uvMorph = new Array(morphCountCache);
          for (let j = 0; j < morphCountCache; j++) {
            this._morphs[i].uvMorph[j]
            = {
              vertexIndex: this._readVertexIndex(),
              uvOffset: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()]
            };
          }
          break;
        case 8:
          this._morphs[i].materialMorph = new Array(morphCountCache);
          for (let j = 0; j < morphCountCache; j++) {
            this._morphs[i].materialMorph[j]
            = {
              materialIndex: this._readMaterialIndex(),
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

  private _loadDisplayFrames(): void {
    const count = this._readInt32();
    this._displayFrames = new Array(count);
    let countCache = 0;
    let targetCache = 0;
    for (let i = 0; i < count; i++) {
      this._displayFrames[i] = {
        frameName: this._readTextBuffer(),
        frameNameEn: this._readTextBuffer(),
        specialFrameFlag: this._readUint8(),
        elementCount: countCache = this._readInt32(),
        targetElementTypes: new Array(countCache),
        targetIndex: new Array(countCache)
      };
      for (let j = 0; j < countCache; j++) {
        this._displayFrames[i].targetElementTypes[j] = targetCache = this._readUint8();
        this._displayFrames[i].targetIndex[j] = targetCache > 0 ? this._readMorphIndex() : this._readBoneIndex();
      }
    }
  }

  private _loadRigidBodies(): void {
    const count = this._readInt32();
    this._rigidBodies = new Array(count);
    for (let i = 0; i < count; i++) {
      this._rigidBodies[i] = {
        rigidBodyName: this._readTextBuffer(),
        rigidBodyNameEn: this._readTextBuffer(),
        boneIndex: this._readBoneIndex(),
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

  private _loadJoints(): void {
    const count = this._readInt32();
    this._joints = new Array(count);
    let typeCache = 0;
    for (let i = 0; i < count; i++) {
      this._joints[i] = {
        jointName: this._readTextBuffer(),
        jointNameEn: this._readTextBuffer(),
        jointType: typeCache = this._readUint8(),
        spring: typeCache === 0 ?
          {
            targetRigidBody1: this._readRegidBodyIndex(),
            targetRigidBody2: this._readRegidBodyIndex(),
            position: [this._readFloat32(), this._readFloat32(), this._readFloat32()],
            rotation: [this._readFloat32(), this._readFloat32(), this._readFloat32()],
            translationLimit: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
            rotationLimit: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()],
            springCoefficientLimit: [this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32(), this._readFloat32()]
          } : undefined
      };
    }
  }

  private _readUTF16LEString(length: number): string {
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

  private _readUTF8String(length: number): string {
    const utf16 = new ArrayBuffer(length * 2);
    const utf16View = new Uint16Array(utf16);
    for (let i = 0; i < length; ++i) {
      utf16View[i] = this._readUint8();
    }
    return String.fromCharCode.apply(null, utf16View);
  }

  private _readUint8(): number {
    const result = this._reader.getUint8(this._offset);
    this._offset += 1;
    return result;
  }

  private _readUint16(): number {
    const result = this._reader.getUint16(this._offset, true);
    this._offset += 2;
    return result;
  }

  private _readUint32(): number {
    const result = this._reader.getUint32(this._offset, true);
    this._offset += 4;
    return result;
  }

  private _readInt8(): number {
    const result = this._reader.getInt8(this._offset);
    this._offset += 1;
    return result;
  }

  private _readInt16(): number {
    const result = this._reader.getInt16(this._offset, true);
    this._offset += 2;
    return result;
  }

  private _readInt32(): number {
    const result = this._reader.getInt32(this._offset, true);
    this._offset += 4;
    return result;
  }

  private _readFloat32(): number {
    const result = this._reader.getFloat32(this._offset, true);
    this._offset += 4;
    return result;
  }
}

export default PMXData;
