import ImageLoader from "../Core/Resources/ImageLoader";
class PMXData {
    constructor(data, resourceDirectory) {
        this._offset = 0;
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
    get Header() {
        return this._header;
    }
    get Verticies() {
        return this._verticies;
    }
    get Surfaces() {
        return this._surfaces;
    }
    get Materials() {
        return this._materials;
    }
    get Textures() {
        return this._textures;
    }
    get Bones() {
        return this._bones;
    }
    get Morphs() {
        return this._morphs;
    }
    _readTextBuffer() {
        const length = this._readInt32();
        if (this._header.encoding === 0) {
            return this._readUTF16LEString(length);
        }
        return this._readUTF8String(length);
    }
    _loadHeader() {
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
    _readBoneIndex() {
        return this._readIndexExceptVertex(this._header.boneIndexSize);
    }
    _readTextureIndex() {
        return this._readIndexExceptVertex(this._header.textureIndexSize);
    }
    _readMorphIndex() {
        return this._readIndexExceptVertex(this._header.morphIndexSize);
    }
    _readMaterialIndex() {
        return this._readIndexExceptVertex(this._header.materialIndexSize);
    }
    _readRegidBodyIndex() {
        return this._readIndexExceptVertex(this._header.rigidBodyIndexSize);
    }
    _readVertexIndex() {
        switch (this._header.vertexIndexSize) {
            case 1:
                return this._readUint8();
            case 2:
                return this._readUint16();
            case 4:
                return this._readInt32();
        }
    }
    _readIndexExceptVertex(byte) {
        switch (byte) {
            case 1:
                return this._readInt8();
            case 2:
                return this._readInt16();
            case 4:
                return this._readInt32();
        }
    }
    _loadVerticies() {
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
        const result = {
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
            bi1 = 0;
            bi2 = 0;
            bi3 = 0;
            bi4 = 0;
            bw1 = 0;
            bw2 = 0;
            bw3 = 0;
            bw4 = 0;
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
                case 0:
                    bi1 = this._readBoneIndex();
                    bw1 = 1;
                    break;
                case 1:
                    bi1 = this._readBoneIndex();
                    bi2 = this._readBoneIndex();
                    bw1 = this._readFloat32();
                    bw2 = 1 - bw1;
                    break;
                case 2:
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
                case 3:
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
    _loadSurfaces() {
        const count = this._readInt32();
        this._surfaces = new Array(count);
        for (let i = 0; i < count / 3; i++) {
            this._surfaces[3 * i + 0] = this._readVertexIndex();
            this._surfaces[3 * i + 2] = this._readVertexIndex();
            this._surfaces[3 * i + 1] = this._readVertexIndex();
        }
    }
    _loadTextures() {
        const count = this._readInt32();
        this._textures = new Array(count);
        for (let i = 0; i < count; i++) {
            this._textures[i] = this._readTextBuffer().replace("\\", "/");
            ImageLoader.loadImage(this._resourceDirectory + this._textures[i]);
        }
    }
    _loadMaterials() {
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
    _loadBones() {
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
                localAxisX: (boneFlagCache & 0x0800) > 0 ? [this._readFloat32(), this._readFloat32(), -this._readFloat32()] : undefined,
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
    _loadMorphs() {
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
    _loadDisplayFrames() {
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
    _loadRigidBodies() {
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
    _loadJoints() {
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
    _readUTF16LEString(length) {
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
    _readUTF8String(length) {
        const utf16 = new ArrayBuffer(length * 2);
        const utf16View = new Uint16Array(utf16);
        for (let i = 0; i < length; ++i) {
            utf16View[i] = this._readUint8();
        }
        return String.fromCharCode.apply(null, utf16View);
    }
    _readUint8() {
        const result = this._reader.getUint8(this._offset);
        this._offset += 1;
        return result;
    }
    _readUint16() {
        const result = this._reader.getUint16(this._offset, true);
        this._offset += 2;
        return result;
    }
    _readUint32() {
        const result = this._reader.getUint32(this._offset, true);
        this._offset += 4;
        return result;
    }
    _readInt8() {
        const result = this._reader.getInt8(this._offset);
        this._offset += 1;
        return result;
    }
    _readInt16() {
        const result = this._reader.getInt16(this._offset, true);
        this._offset += 2;
        return result;
    }
    _readInt32() {
        const result = this._reader.getInt32(this._offset, true);
        this._offset += 4;
        return result;
    }
    _readFloat32() {
        const result = this._reader.getFloat32(this._offset, true);
        this._offset += 4;
        return result;
    }
}
export default PMXData;

//# sourceMappingURL=data:application/json;base64,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LENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztRQUNsQixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxTQUFTO1FBQ2YsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDO1FBQ2xCLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVPLFVBQVU7UUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztRQUNsQixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxVQUFVO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUM7UUFDbEIsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU8sWUFBWTtRQUNsQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDO1FBQ2xCLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLE9BQU8sQ0FBQyIsImZpbGUiOiJQTVgvUE1YRGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQTVhIZWFkZXIgZnJvbSBcIi4vUE1YSGVhZGVyRGF0YVwiO1xuaW1wb3J0IFBNWFZlcnRpY2llcyBmcm9tIFwiLi9QTVhWZXJ0aWNpZXNEYXRhXCI7XG5pbXBvcnQgUE1YTWF0ZXJpYWwgZnJvbSBcIi4vUE1YTWF0ZXJpYWxEYXRhXCI7XG5pbXBvcnQgUE1YQm9uZSBmcm9tIFwiLi9QTVhCb25lRGF0YVwiO1xuaW1wb3J0IFBNWE1vcnBoIGZyb20gXCIuL1BNWE1vcnBoRGF0YVwiO1xuaW1wb3J0IFBNWERpc3BsYXlGcmFtZSBmcm9tIFwiLi9QTVhEaXNwbGF5RnJhbWVEYXRhXCI7XG5pbXBvcnQgUE1YUmlnaWRCb2R5IGZyb20gXCIuL1BNWFJpZ2lkQm9keURhdGFcIjtcbmltcG9ydCBQTVhKb2ludCBmcm9tIFwiLi9QTVhKb2ludERhdGFcIjtcbmltcG9ydCBJbWFnZUxvYWRlciBmcm9tIFwiLi4vQ29yZS9SZXNvdXJjZXMvSW1hZ2VMb2FkZXJcIjtcbmNsYXNzIFBNWERhdGEge1xuICBwcml2YXRlIF9yZWFkZXI6IERhdGFWaWV3O1xuXG4gIHByaXZhdGUgX2hlYWRlcjogUE1YSGVhZGVyO1xuXG4gIHByaXZhdGUgX3ZlcnRpY2llczogUE1YVmVydGljaWVzO1xuXG4gIHByaXZhdGUgX3N1cmZhY2VzOiBudW1iZXJbXTtcblxuICBwcml2YXRlIF90ZXh0dXJlczogc3RyaW5nW107XG5cbiAgcHJpdmF0ZSBfbWF0ZXJpYWxzOiBQTVhNYXRlcmlhbFtdO1xuXG4gIHByaXZhdGUgX2JvbmVzOiBQTVhCb25lW107XG5cbiAgcHJpdmF0ZSBfbW9ycGhzOiBQTVhNb3JwaFtdO1xuXG4gIHByaXZhdGUgX2Rpc3BsYXlGcmFtZXM6IFBNWERpc3BsYXlGcmFtZVtdO1xuXG4gIHByaXZhdGUgX3JpZ2lkQm9kaWVzOiBQTVhSaWdpZEJvZHlbXTtcblxuICBwcml2YXRlIF9qb2ludHM6IFBNWEpvaW50W107XG5cbiAgcHJpdmF0ZSBfcmVzb3VyY2VEaXJlY3Rvcnk6IHN0cmluZztcblxuICBwcml2YXRlIF9vZmZzZXQ6IG51bWJlciA9IDA7XG5cbiAgcHVibGljIGdldCBIZWFkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYWRlcjtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgVmVydGljaWVzKCkge1xuICAgIHJldHVybiB0aGlzLl92ZXJ0aWNpZXM7XG4gIH1cblxuICBwdWJsaWMgZ2V0IFN1cmZhY2VzKCkge1xuICAgIHJldHVybiB0aGlzLl9zdXJmYWNlcztcbiAgfVxuXG4gIHB1YmxpYyBnZXQgTWF0ZXJpYWxzKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbHM7XG4gIH1cblxuICBwdWJsaWMgZ2V0IFRleHR1cmVzKCkge1xuICAgIHJldHVybiB0aGlzLl90ZXh0dXJlcztcbiAgfVxuXG4gIHB1YmxpYyBnZXQgQm9uZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JvbmVzO1xuICB9XG5cbiAgcHVibGljIGdldCBNb3JwaHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21vcnBocztcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGRhdGE6IEFycmF5QnVmZmVyLCByZXNvdXJjZURpcmVjdG9yeTogc3RyaW5nKSB7XG4gICAgdGhpcy5fcmVzb3VyY2VEaXJlY3RvcnkgPSByZXNvdXJjZURpcmVjdG9yeTtcbiAgICB0aGlzLl9yZWFkZXIgPSBuZXcgRGF0YVZpZXcoZGF0YSwgMCwgZGF0YS5ieXRlTGVuZ3RoKTtcbiAgICB0aGlzLl9sb2FkSGVhZGVyKCk7XG4gICAgdGhpcy5fbG9hZFZlcnRpY2llcygpO1xuICAgIHRoaXMuX2xvYWRTdXJmYWNlcygpO1xuICAgIHRoaXMuX2xvYWRUZXh0dXJlcygpO1xuICAgIHRoaXMuX2xvYWRNYXRlcmlhbHMoKTtcbiAgICB0aGlzLl9sb2FkQm9uZXMoKTtcbiAgICB0aGlzLl9sb2FkTW9ycGhzKCk7XG4gICAgdGhpcy5fbG9hZERpc3BsYXlGcmFtZXMoKTtcbiAgICB0aGlzLl9sb2FkUmlnaWRCb2RpZXMoKTtcbiAgICB0aGlzLl9sb2FkSm9pbnRzKCk7XG4gIH1cblxuICBwcml2YXRlIF9yZWFkVGV4dEJ1ZmZlcigpOiBzdHJpbmcge1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuX3JlYWRJbnQzMigpO1xuICAgIGlmICh0aGlzLl9oZWFkZXIuZW5jb2RpbmcgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZWFkVVRGMTZMRVN0cmluZyhsZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcmVhZFVURjhTdHJpbmcobGVuZ3RoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2xvYWRIZWFkZXIoKTogdm9pZCB7XG4gICAgdGhpcy5fcmVhZFVpbnQzMigpOyAvLyBwYXNzIG1hZ2ljXG4gICAgdGhpcy5faGVhZGVyID0ge1xuICAgICAgdmVyc2lvbjogdGhpcy5fcmVhZEZsb2F0MzIoKSxcbiAgICAgIGhlYWRlckJ5dGVTaXplOiB0aGlzLl9yZWFkVWludDgoKSxcbiAgICAgIGVuY29kaW5nOiB0aGlzLl9yZWFkVWludDgoKSxcbiAgICAgIHV2QWRkaXRpb246IHRoaXMuX3JlYWRVaW50OCgpLFxuICAgICAgdmVydGV4SW5kZXhTaXplOiB0aGlzLl9yZWFkVWludDgoKSxcbiAgICAgIHRleHR1cmVJbmRleFNpemU6IHRoaXMuX3JlYWRVaW50OCgpLFxuICAgICAgbWF0ZXJpYWxJbmRleFNpemU6IHRoaXMuX3JlYWRVaW50OCgpLFxuICAgICAgYm9uZUluZGV4U2l6ZTogdGhpcy5fcmVhZFVpbnQ4KCksXG4gICAgICBtb3JwaEluZGV4U2l6ZTogdGhpcy5fcmVhZFVpbnQ4KCksXG4gICAgICByaWdpZEJvZHlJbmRleFNpemU6IHRoaXMuX3JlYWRVaW50OCgpLFxuICAgICAgbW9kZWxOYW1lOiBcIlwiLFxuICAgICAgbW9kZWxOYW1lRW46IFwiXCIsXG4gICAgICBjb21tZW50OiBcIlwiLFxuICAgICAgY29tbWVudEVuOiBcIlwiXG4gICAgfTtcbiAgICB0aGlzLl9oZWFkZXIubW9kZWxOYW1lID0gdGhpcy5fcmVhZFRleHRCdWZmZXIoKTtcbiAgICB0aGlzLl9oZWFkZXIubW9kZWxOYW1lRW4gPSB0aGlzLl9yZWFkVGV4dEJ1ZmZlcigpO1xuICAgIHRoaXMuX2hlYWRlci5jb21tZW50ID0gdGhpcy5fcmVhZFRleHRCdWZmZXIoKTtcbiAgICB0aGlzLl9oZWFkZXIuY29tbWVudEVuID0gdGhpcy5fcmVhZFRleHRCdWZmZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlYWRCb25lSW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcmVhZEluZGV4RXhjZXB0VmVydGV4KHRoaXMuX2hlYWRlci5ib25lSW5kZXhTaXplKTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlYWRUZXh0dXJlSW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcmVhZEluZGV4RXhjZXB0VmVydGV4KHRoaXMuX2hlYWRlci50ZXh0dXJlSW5kZXhTaXplKTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlYWRNb3JwaEluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3JlYWRJbmRleEV4Y2VwdFZlcnRleCh0aGlzLl9oZWFkZXIubW9ycGhJbmRleFNpemUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVhZE1hdGVyaWFsSW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcmVhZEluZGV4RXhjZXB0VmVydGV4KHRoaXMuX2hlYWRlci5tYXRlcmlhbEluZGV4U2l6ZSk7XG4gIH1cblxuICBwcml2YXRlIF9yZWFkUmVnaWRCb2R5SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcmVhZEluZGV4RXhjZXB0VmVydGV4KHRoaXMuX2hlYWRlci5yaWdpZEJvZHlJbmRleFNpemUpO1xuICB9XG4gIHByaXZhdGUgX3JlYWRWZXJ0ZXhJbmRleCgpOiBudW1iZXIge1xuICAgIHN3aXRjaCAodGhpcy5faGVhZGVyLnZlcnRleEluZGV4U2l6ZSkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gdGhpcy5fcmVhZFVpbnQ4KCk7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWFkVWludDE2KCk7XG4gICAgICBjYXNlIDQ6XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWFkSW50MzIoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9yZWFkSW5kZXhFeGNlcHRWZXJ0ZXgoYnl0ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBzd2l0Y2ggKGJ5dGUpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRJbnQ4KCk7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWFkSW50MTYoKTtcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRJbnQzMigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2xvYWRWZXJ0aWNpZXMoKTogdm9pZCB7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLl9yZWFkSW50MzIoKTtcbiAgICBjb25zdCB1dkNvdW50ID0gdGhpcy5faGVhZGVyLnV2QWRkaXRpb247XG4gICAgLy8gYWxsb2NhdGUgYXJyYXlzXG4gICAgY29uc3QgYWRkaXRpb25hbFV2cyA9IG5ldyBBcnJheSh1dkNvdW50KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHV2Q291bnQ7IGkrKykge1xuICAgICAgYWRkaXRpb25hbFV2c1tpXSA9IG5ldyBBcnJheShjb3VudCAqIDQpO1xuICAgIH1cbiAgICBsZXQgYmkxID0gMCwgYmkyID0gMCwgYmkzID0gMCwgYmk0ID0gMDtcbiAgICBsZXQgYncxID0gMCwgYncyID0gMCwgYnczID0gMCwgYnc0ID0gMDtcbiAgICBsZXQgc3VtQ2FjaGUgPSAwO1xuICAgIGNvbnN0IHJlc3VsdDogUE1YVmVydGljaWVzID0ge1xuICAgICAgcG9zaXRpb25zOiBuZXcgQXJyYXkoY291bnQgKiAzKSxcbiAgICAgIG5vcm1hbHM6IG5ldyBGbG9hdDMyQXJyYXkoY291bnQgKiAzKSxcbiAgICAgIHV2czogbmV3IEFycmF5KGNvdW50ICogMiksXG4gICAgICBhZGRpdGlvbmFsVVY6IGFkZGl0aW9uYWxVdnMsXG4gICAgICBlZGdlU2NhbGluZzogbmV3IEZsb2F0MzJBcnJheShjb3VudCksXG4gICAgICB2ZXJ0aWNpZXM6IG5ldyBBcnJheShjb3VudCksXG4gICAgICBib25lSW5kaWNpZXM6IG5ldyBGbG9hdDMyQXJyYXkoY291bnQgKiA0KSxcbiAgICAgIGJvbmVXZWlnaHRzOiBuZXcgRmxvYXQzMkFycmF5KGNvdW50ICogNClcbiAgICB9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgYmkxID0gMDsgYmkyID0gMDsgYmkzID0gMDsgYmk0ID0gMDtcbiAgICAgIGJ3MSA9IDA7IGJ3MiA9IDA7IGJ3MyA9IDA7IGJ3NCA9IDA7XG4gICAgICByZXN1bHQucG9zaXRpb25zWzMgKiBpICsgMF0gPSB0aGlzLl9yZWFkRmxvYXQzMigpO1xuICAgICAgcmVzdWx0LnBvc2l0aW9uc1szICogaSArIDFdID0gdGhpcy5fcmVhZEZsb2F0MzIoKTtcbiAgICAgIHJlc3VsdC5wb3NpdGlvbnNbMyAqIGkgKyAyXSA9IC10aGlzLl9yZWFkRmxvYXQzMigpO1xuICAgICAgcmVzdWx0Lm5vcm1hbHNbMyAqIGkgKyAwXSA9IHRoaXMuX3JlYWRGbG9hdDMyKCk7XG4gICAgICByZXN1bHQubm9ybWFsc1szICogaSArIDFdID0gdGhpcy5fcmVhZEZsb2F0MzIoKTtcbiAgICAgIHJlc3VsdC5ub3JtYWxzWzMgKiBpICsgMl0gPSAtdGhpcy5fcmVhZEZsb2F0MzIoKTtcbiAgICAgIHJlc3VsdC51dnNbMiAqIGkgKyAwXSA9IHRoaXMuX3JlYWRGbG9hdDMyKCk7XG4gICAgICByZXN1bHQudXZzWzIgKiBpICsgMV0gPSB0aGlzLl9yZWFkRmxvYXQzMigpO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB1dkNvdW50OyBqKyspIHtcbiAgICAgICAgcmVzdWx0LmFkZGl0aW9uYWxVVltqXVs0ICogaSArIDBdID0gdGhpcy5fcmVhZEZsb2F0MzIoKTtcbiAgICAgICAgcmVzdWx0LmFkZGl0aW9uYWxVVltqXVs0ICogaSArIDFdID0gdGhpcy5fcmVhZEZsb2F0MzIoKTtcbiAgICAgICAgcmVzdWx0LmFkZGl0aW9uYWxVVltqXVs0ICogaSArIDJdID0gdGhpcy5fcmVhZEZsb2F0MzIoKTtcbiAgICAgICAgcmVzdWx0LmFkZGl0aW9uYWxVVltqXVs0ICogaSArIDNdID0gdGhpcy5fcmVhZEZsb2F0MzIoKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC52ZXJ0aWNpZXNbaV0gPSB7IHdlaWdodFRyYW5zZm9ybTogdGhpcy5fcmVhZFVpbnQ4KCkgfTtcbiAgICAgIHN3aXRjaCAocmVzdWx0LnZlcnRpY2llc1tpXS53ZWlnaHRUcmFuc2Zvcm0pIHtcbiAgICAgICAgY2FzZSAwOiAvLyBCREVGXG4gICAgICAgICAgYmkxID0gdGhpcy5fcmVhZEJvbmVJbmRleCgpO1xuICAgICAgICAgIGJ3MSA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTogLy8gQkRFRjJcbiAgICAgICAgICBiaTEgPSB0aGlzLl9yZWFkQm9uZUluZGV4KCk7XG4gICAgICAgICAgYmkyID0gdGhpcy5fcmVhZEJvbmVJbmRleCgpO1xuICAgICAgICAgIGJ3MSA9IHRoaXMuX3JlYWRGbG9hdDMyKCk7XG4gICAgICAgICAgYncyID0gMSAtIGJ3MTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOiAvLyBCREVGNFxuICAgICAgICAgIGJpMSA9IHRoaXMuX3JlYWRCb25lSW5kZXgoKTtcbiAgICAgICAgICBiaTIgPSB0aGlzLl9yZWFkQm9uZUluZGV4KCk7XG4gICAgICAgICAgYmkzID0gdGhpcy5fcmVhZEJvbmVJbmRleCgpO1xuICAgICAgICAgIGJpNCA9IHRoaXMuX3JlYWRCb25lSW5kZXgoKTtcbiAgICAgICAgICBidzEgPSB0aGlzLl9yZWFkRmxvYXQzMigpO1xuICAgICAgICAgIGJ3MiA9IHRoaXMuX3JlYWRGbG9hdDMyKCk7XG4gICAgICAgICAgYnczID0gdGhpcy5fcmVhZEZsb2F0MzIoKTtcbiAgICAgICAgICBidzQgPSB0aGlzLl9yZWFkRmxvYXQzMigpO1xuICAgICAgICAgIHN1bUNhY2hlID0gYncxICsgYncyICsgYnczICsgYnc0O1xuICAgICAgICAgIGJ3MSAvPSBzdW1DYWNoZTtcbiAgICAgICAgICBidzIgLz0gc3VtQ2FjaGU7XG4gICAgICAgICAgYnczIC89IHN1bUNhY2hlO1xuICAgICAgICAgIGJ3NCAvPSBzdW1DYWNoZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOiAvLyBTREVGXG4gICAgICAgICAgYmkxID0gdGhpcy5fcmVhZEJvbmVJbmRleCgpO1xuICAgICAgICAgIGJpMiA9IHRoaXMuX3JlYWRCb25lSW5kZXgoKTtcbiAgICAgICAgICBidzEgPSB0aGlzLl9yZWFkRmxvYXQzMigpO1xuICAgICAgICAgIGJ3MiA9IDEgLSBidzE7XG4gICAgICAgICAgcmVzdWx0LnZlcnRpY2llc1tpXS5zZGVmID0ge1xuICAgICAgICAgICAgYm9uZVBhcmFtczogW1xuICAgICAgICAgICAgICB0aGlzLl9yZWFkRmxvYXQzMigpLFxuICAgICAgICAgICAgICB0aGlzLl9yZWFkRmxvYXQzMigpLFxuICAgICAgICAgICAgICB0aGlzLl9yZWFkRmxvYXQzMigpLFxuICAgICAgICAgICAgICB0aGlzLl9yZWFkRmxvYXQzMigpLFxuICAgICAgICAgICAgICB0aGlzLl9yZWFkRmxvYXQzMigpLFxuICAgICAgICAgICAgICB0aGlzLl9yZWFkRmxvYXQzMigpLFxuICAgICAgICAgICAgICB0aGlzLl9yZWFkRmxvYXQzMigpLFxuICAgICAgICAgICAgICB0aGlzLl9yZWFkRmxvYXQzMigpLFxuICAgICAgICAgICAgICB0aGlzLl9yZWFkRmxvYXQzMigpLFxuICAgICAgICAgICAgXVxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICByZXN1bHQuYm9uZUluZGljaWVzWzQgKiBpICsgMF0gPSBiaTE7XG4gICAgICByZXN1bHQuYm9uZUluZGljaWVzWzQgKiBpICsgMV0gPSBiaTI7XG4gICAgICByZXN1bHQuYm9uZUluZGljaWVzWzQgKiBpICsgMl0gPSBiaTM7XG4gICAgICByZXN1bHQuYm9uZUluZGljaWVzWzQgKiBpICsgM10gPSBiaTQ7XG4gICAgICByZXN1bHQuYm9uZVdlaWdodHNbNCAqIGkgKyAwXSA9IGJ3MTtcbiAgICAgIHJlc3VsdC5ib25lV2VpZ2h0c1s0ICogaSArIDFdID0gYncyO1xuICAgICAgcmVzdWx0LmJvbmVXZWlnaHRzWzQgKiBpICsgMl0gPSBidzM7XG4gICAgICByZXN1bHQuYm9uZVdlaWdodHNbNCAqIGkgKyAzXSA9IGJ3NDtcbiAgICAgIHJlc3VsdC5lZGdlU2NhbGluZ1tpXSA9IHRoaXMuX3JlYWRGbG9hdDMyKCk7XG4gICAgfVxuICAgIHRoaXMuX3ZlcnRpY2llcyA9IHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgX2xvYWRTdXJmYWNlcygpOiB2b2lkIHtcbiAgICBjb25zdCBjb3VudCA9IHRoaXMuX3JlYWRJbnQzMigpO1xuICAgIHRoaXMuX3N1cmZhY2VzID0gbmV3IEFycmF5KGNvdW50KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50IC8gMzsgaSsrKSB7XG4gICAgICB0aGlzLl9zdXJmYWNlc1szICogaSArIDBdID0gdGhpcy5fcmVhZFZlcnRleEluZGV4KCk7XG4gICAgICB0aGlzLl9zdXJmYWNlc1szICogaSArIDJdID0gdGhpcy5fcmVhZFZlcnRleEluZGV4KCk7XG4gICAgICB0aGlzLl9zdXJmYWNlc1szICogaSArIDFdID0gdGhpcy5fcmVhZFZlcnRleEluZGV4KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbG9hZFRleHR1cmVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGNvdW50ID0gdGhpcy5fcmVhZEludDMyKCk7XG4gICAgdGhpcy5fdGV4dHVyZXMgPSBuZXcgQXJyYXkoY291bnQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgdGhpcy5fdGV4dHVyZXNbaV0gPSB0aGlzLl9yZWFkVGV4dEJ1ZmZlcigpLnJlcGxhY2UoXCJcXFxcXCIsIFwiL1wiKTtcbiAgICAgIEltYWdlTG9hZGVyLmxvYWRJbWFnZSh0aGlzLl9yZXNvdXJjZURpcmVjdG9yeSArIHRoaXMuX3RleHR1cmVzW2ldKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9sb2FkTWF0ZXJpYWxzKCk6IHZvaWQge1xuICAgIGNvbnN0IGNvdW50ID0gdGhpcy5fcmVhZEludDMyKCk7XG4gICAgdGhpcy5fbWF0ZXJpYWxzID0gbmV3IEFycmF5KGNvdW50KTtcbiAgICBsZXQgY2FjaGUgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgdGhpcy5fbWF0ZXJpYWxzW2ldID0ge1xuICAgICAgICBtYXRlcmlhbE5hbWU6IHRoaXMuX3JlYWRUZXh0QnVmZmVyKCksXG4gICAgICAgIG1hdGVyaWFsTmFtZUVuOiB0aGlzLl9yZWFkVGV4dEJ1ZmZlcigpLFxuICAgICAgICBkaWZmdXNlOiBbdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKV0sXG4gICAgICAgIHNwZWN1bGFyOiBbdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKV0sXG4gICAgICAgIGFtYmllbnQ6IFt0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpXSxcbiAgICAgICAgZHJhd0ZsYWc6IHRoaXMuX3JlYWRVaW50OCgpLFxuICAgICAgICBlZGdlQ29sb3I6IFt0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpXSxcbiAgICAgICAgZWRnZVNpemU6IHRoaXMuX3JlYWRGbG9hdDMyKCksXG4gICAgICAgIHRleHR1cmVJbmRleDogdGhpcy5fcmVhZFRleHR1cmVJbmRleCgpLFxuICAgICAgICBzcGhlcmVUZXh0dXJlSW5kZXg6IHRoaXMuX3JlYWRUZXh0dXJlSW5kZXgoKSxcbiAgICAgICAgc3BoZXJlTW9kZTogdGhpcy5fcmVhZFVpbnQ4KCksXG4gICAgICAgIHNoYXJlZFRvb25GbGFnOiBjYWNoZSA9IHRoaXMuX3JlYWRVaW50OCgpLFxuICAgICAgICB0YXJnZXRUb29uSW5kZXg6IGNhY2hlID09PSAwID8gdGhpcy5fcmVhZFRleHR1cmVJbmRleCgpIDogdGhpcy5fcmVhZFVpbnQ4KCksXG4gICAgICAgIG1lbW86IHRoaXMuX3JlYWRUZXh0QnVmZmVyKCksXG4gICAgICAgIHZlcnRleENvdW50OiB0aGlzLl9yZWFkSW50MzIoKSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbG9hZEJvbmVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGNvdW50ID0gdGhpcy5fcmVhZFVpbnQzMigpO1xuICAgIHRoaXMuX2JvbmVzID0gbmV3IEFycmF5KGNvdW50KTtcbiAgICBsZXQgYm9uZUZsYWdDYWNoZSA9IDA7XG4gICAgbGV0IGlrTGlua0NvdW50Q2FjaGUgPSAwO1xuICAgIGxldCBpa0xpbWl0ZWRDYWNoZSA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICB0aGlzLl9ib25lc1tpXSA9IHtcbiAgICAgICAgYm9uZU5hbWU6IHRoaXMuX3JlYWRUZXh0QnVmZmVyKCksXG4gICAgICAgIGJvbmVOYW1lRW46IHRoaXMuX3JlYWRUZXh0QnVmZmVyKCksXG4gICAgICAgIHBvc2l0aW9uOiBbdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgLXRoaXMuX3JlYWRGbG9hdDMyKCldLFxuICAgICAgICBwYXJlbnRCb25lSW5kZXg6IHRoaXMuX3JlYWRCb25lSW5kZXgoKSxcbiAgICAgICAgdHJhbnNmb3JtTGF5ZXI6IHRoaXMuX3JlYWRJbnQzMigpLFxuICAgICAgICBib25lRmxhZzogYm9uZUZsYWdDYWNoZSA9IHRoaXMuX3JlYWRVaW50MTYoKSxcbiAgICAgICAgcG9zaXRpb25PZmZzZXQ6IChib25lRmxhZ0NhY2hlICYgMHgwMDAxKSA9PT0gMCA/IFt0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCAtdGhpcy5fcmVhZEZsb2F0MzIoKV0gOiB1bmRlZmluZWQsXG4gICAgICAgIGNvbm5lY3RpbmdCb25lSW5kZXg6IChib25lRmxhZ0NhY2hlICYgMHgwMDAxKSA+IDAgPyB0aGlzLl9yZWFkQm9uZUluZGV4KCkgOiB1bmRlZmluZWQsXG4gICAgICAgIHByb3ZpZGluZ0JvbmVJbmRleDogKGJvbmVGbGFnQ2FjaGUgJiAweDAxMDApID4gMCB8fCAoYm9uZUZsYWdDYWNoZSAmIDB4MDIwMCkgPiAwID8gdGhpcy5fcmVhZEJvbmVJbmRleCgpIDogdW5kZWZpbmVkLFxuICAgICAgICBwcm92aWRpbmdSYXRlOiAoYm9uZUZsYWdDYWNoZSAmIDB4MDEwMCkgPiAwIHx8IChib25lRmxhZ0NhY2hlICYgMHgwMjAwKSA+IDAgPyB0aGlzLl9yZWFkRmxvYXQzMigpIDogdW5kZWZpbmVkLFxuICAgICAgICBmaXhlZEF4aXM6IChib25lRmxhZ0NhY2hlICYgMHgwNDAwKSA+IDAgPyBbdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgLXRoaXMuX3JlYWRGbG9hdDMyKCldIDogdW5kZWZpbmVkLFxuICAgICAgICBsb2NhbEF4aXNYOiAoYm9uZUZsYWdDYWNoZSAmIDB4MDgwMCkgPiAwID8gW3RoaXMuX3JlYWRGbG9hdDMyKCksIHRoaXMuX3JlYWRGbG9hdDMyKCksIC0gdGhpcy5fcmVhZEZsb2F0MzIoKV0gOiB1bmRlZmluZWQsXG4gICAgICAgIGxvY2FsQXhpc1o6IChib25lRmxhZ0NhY2hlICYgMHgwODAwKSA+IDAgPyBbdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgLXRoaXMuX3JlYWRGbG9hdDMyKCldIDogdW5kZWZpbmVkLFxuICAgICAgICBleHRlcm5hbFBhcmVudFRyYW5zZm9ybUtleTogKGJvbmVGbGFnQ2FjaGUgJiAweDIwMDApID4gMCA/IHRoaXMuX3JlYWRJbnQzMigpIDogdW5kZWZpbmVkLFxuICAgICAgICBpa1RhcmdldEJvbmVJbmRleDogKGJvbmVGbGFnQ2FjaGUgJiAweDAwMjApID4gMCA/IHRoaXMuX3JlYWRCb25lSW5kZXgoKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgaWtMb29wQ291bnQ6IChib25lRmxhZ0NhY2hlICYgMHgwMDIwKSA+IDAgPyB0aGlzLl9yZWFkSW50MzIoKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgaWtMaW1pdGVkUm90YXRpb246IChib25lRmxhZ0NhY2hlICYgMHgwMDIwKSA+IDAgPyB0aGlzLl9yZWFkRmxvYXQzMigpIDogdW5kZWZpbmVkLFxuICAgICAgICBpa0xpbmtDb3VudDogKGJvbmVGbGFnQ2FjaGUgJiAweDAwMjApID4gMCA/IGlrTGlua0NvdW50Q2FjaGUgPSB0aGlzLl9yZWFkSW50MzIoKSA6IGlrTGlua0NvdW50Q2FjaGUgPSB1bmRlZmluZWQsXG4gICAgICAgIGlrTGlua3M6IChib25lRmxhZ0NhY2hlICYgMHgwMDIwKSA+IDAgPyBuZXcgQXJyYXkoaWtMaW5rQ291bnRDYWNoZSkgOiB1bmRlZmluZWRcbiAgICAgIH07XG4gICAgICBpZiAoaWtMaW5rQ291bnRDYWNoZSkge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGlrTGlua0NvdW50Q2FjaGU7IGorKykge1xuICAgICAgICAgIHRoaXMuX2JvbmVzW2ldLmlrTGlua3Nbal0gPSB7XG4gICAgICAgICAgICBpa0xpbmtCb25lSW5kZXg6IHRoaXMuX3JlYWRCb25lSW5kZXgoKSxcbiAgICAgICAgICAgIGlzTGltaXRlZFJvdGF0aW9uOiBpa0xpbWl0ZWRDYWNoZSA9IHRoaXMuX3JlYWRVaW50OCgpLFxuICAgICAgICAgICAgbGltaXRlZFJvdGF0aW9uOiBpa0xpbWl0ZWRDYWNoZSA+IDAgPyBbdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKV0gOiB1bmRlZmluZWRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2xvYWRNb3JwaHMoKTogdm9pZCB7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLl9yZWFkSW50MzIoKTtcbiAgICB0aGlzLl9tb3JwaHMgPSBuZXcgQXJyYXkoY291bnQpO1xuICAgIGxldCBtb3JwaENvdW50Q2FjaGUgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgdGhpcy5fbW9ycGhzW2ldID0ge1xuICAgICAgICBtb3JwaE5hbWU6IHRoaXMuX3JlYWRUZXh0QnVmZmVyKCksXG4gICAgICAgIG1vcnBoTmFtZUVuOiB0aGlzLl9yZWFkVGV4dEJ1ZmZlcigpLFxuICAgICAgICBlZGl0UGFuZWw6IHRoaXMuX3JlYWRVaW50OCgpLFxuICAgICAgICBtb3JwaEtpbmQ6IHRoaXMuX3JlYWRVaW50OCgpLFxuICAgICAgICBtb3JwaE9mZnNldENvdW50OiBtb3JwaENvdW50Q2FjaGUgPSB0aGlzLl9yZWFkSW50MzIoKVxuICAgICAgfTtcbiAgICAgIHN3aXRjaCAodGhpcy5fbW9ycGhzW2ldLm1vcnBoS2luZCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgLy8gZ3JvdXAgbW9ycGhcbiAgICAgICAgICB0aGlzLl9tb3JwaHNbaV0uZ3JvdXBNb3JwaCA9IG5ldyBBcnJheShtb3JwaENvdW50Q2FjaGUpO1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbW9ycGhDb3VudENhY2hlOyBqKyspIHtcbiAgICAgICAgICAgIHRoaXMuX21vcnBoc1tpXS5ncm91cE1vcnBoW2pdID0ge1xuICAgICAgICAgICAgICBtb3JwaEluZGV4OiB0aGlzLl9yZWFkTW9ycGhJbmRleCgpLFxuICAgICAgICAgICAgICBtb3JwaFJhdGU6IHRoaXMuX3JlYWRGbG9hdDMyKClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgdGhpcy5fbW9ycGhzW2ldLnZlcnRleE1vcnBoID0gbmV3IEFycmF5KG1vcnBoQ291bnRDYWNoZSk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtb3JwaENvdW50Q2FjaGU7IGorKykge1xuICAgICAgICAgICAgdGhpcy5fbW9ycGhzW2ldLnZlcnRleE1vcnBoW2pdID0ge1xuICAgICAgICAgICAgICB2ZXJ0ZXhJbmRleDogdGhpcy5fcmVhZFZlcnRleEluZGV4KCksXG4gICAgICAgICAgICAgIHZlcnRleE9mZnNldDogW3RoaXMuX3JlYWRGbG9hdDMyKCksIHRoaXMuX3JlYWRGbG9hdDMyKCksIC10aGlzLl9yZWFkRmxvYXQzMigpXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aGlzLl9tb3JwaHNbaV0uYm9uZU1vcnBoID0gbmV3IEFycmF5KG1vcnBoQ291bnRDYWNoZSk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtb3JwaENvdW50Q2FjaGU7IGorKykge1xuICAgICAgICAgICAgdGhpcy5fbW9ycGhzW2ldLmJvbmVNb3JwaFtqXVxuICAgICAgICAgICAgPSB7XG4gICAgICAgICAgICAgIGJvbmVJbmRleDogdGhpcy5fcmVhZEJvbmVJbmRleCgpLFxuICAgICAgICAgICAgICB0cmFuc2xhdGlvbk9mZnNldDogW3RoaXMuX3JlYWRGbG9hdDMyKCksIHRoaXMuX3JlYWRGbG9hdDMyKCksIC10aGlzLl9yZWFkRmxvYXQzMigpXSxcbiAgICAgICAgICAgICAgcm90YXRpb25PZmZzZXQ6IFt0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICBjYXNlIDU6XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgIHRoaXMuX21vcnBoc1tpXS51dk1vcnBoID0gbmV3IEFycmF5KG1vcnBoQ291bnRDYWNoZSk7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtb3JwaENvdW50Q2FjaGU7IGorKykge1xuICAgICAgICAgICAgdGhpcy5fbW9ycGhzW2ldLnV2TW9ycGhbal1cbiAgICAgICAgICAgID0ge1xuICAgICAgICAgICAgICB2ZXJ0ZXhJbmRleDogdGhpcy5fcmVhZFZlcnRleEluZGV4KCksXG4gICAgICAgICAgICAgIHV2T2Zmc2V0OiBbdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKV1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgdGhpcy5fbW9ycGhzW2ldLm1hdGVyaWFsTW9ycGggPSBuZXcgQXJyYXkobW9ycGhDb3VudENhY2hlKTtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1vcnBoQ291bnRDYWNoZTsgaisrKSB7XG4gICAgICAgICAgICB0aGlzLl9tb3JwaHNbaV0ubWF0ZXJpYWxNb3JwaFtqXVxuICAgICAgICAgICAgPSB7XG4gICAgICAgICAgICAgIG1hdGVyaWFsSW5kZXg6IHRoaXMuX3JlYWRNYXRlcmlhbEluZGV4KCksXG4gICAgICAgICAgICAgIG9wZXJhdGlvblR5cGU6IHRoaXMuX3JlYWRVaW50OCgpLFxuICAgICAgICAgICAgICBkaWZmdXNlOiBbdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKV0sXG4gICAgICAgICAgICAgIHNwZWN1bGFyOiBbdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKV0sXG4gICAgICAgICAgICAgIGFtYmllbnQ6IFt0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpXSxcbiAgICAgICAgICAgICAgZWRnZUNvbG9yOiBbdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKV0sXG4gICAgICAgICAgICAgIGVkZ2VTaXplOiB0aGlzLl9yZWFkRmxvYXQzMigpLFxuICAgICAgICAgICAgICB0ZXh0dXJlQ29lZmZpY2llbnQ6IFt0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpXSxcbiAgICAgICAgICAgICAgc3BoZXJlVGV4dHVyZUNvZWZmaWNpZW50OiBbdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKSwgdGhpcy5fcmVhZEZsb2F0MzIoKV0sXG4gICAgICAgICAgICAgIHRvb25UZXh0dXJlQ29lZmZpY2llbnQ6IFt0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbG9hZERpc3BsYXlGcmFtZXMoKTogdm9pZCB7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLl9yZWFkSW50MzIoKTtcbiAgICB0aGlzLl9kaXNwbGF5RnJhbWVzID0gbmV3IEFycmF5KGNvdW50KTtcbiAgICBsZXQgY291bnRDYWNoZSA9IDA7XG4gICAgbGV0IHRhcmdldENhY2hlID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIHRoaXMuX2Rpc3BsYXlGcmFtZXNbaV0gPSB7XG4gICAgICAgIGZyYW1lTmFtZTogdGhpcy5fcmVhZFRleHRCdWZmZXIoKSxcbiAgICAgICAgZnJhbWVOYW1lRW46IHRoaXMuX3JlYWRUZXh0QnVmZmVyKCksXG4gICAgICAgIHNwZWNpYWxGcmFtZUZsYWc6IHRoaXMuX3JlYWRVaW50OCgpLFxuICAgICAgICBlbGVtZW50Q291bnQ6IGNvdW50Q2FjaGUgPSB0aGlzLl9yZWFkSW50MzIoKSxcbiAgICAgICAgdGFyZ2V0RWxlbWVudFR5cGVzOiBuZXcgQXJyYXkoY291bnRDYWNoZSksXG4gICAgICAgIHRhcmdldEluZGV4OiBuZXcgQXJyYXkoY291bnRDYWNoZSlcbiAgICAgIH07XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdW50Q2FjaGU7IGorKykge1xuICAgICAgICB0aGlzLl9kaXNwbGF5RnJhbWVzW2ldLnRhcmdldEVsZW1lbnRUeXBlc1tqXSA9IHRhcmdldENhY2hlID0gdGhpcy5fcmVhZFVpbnQ4KCk7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlGcmFtZXNbaV0udGFyZ2V0SW5kZXhbal0gPSB0YXJnZXRDYWNoZSA+IDAgPyB0aGlzLl9yZWFkTW9ycGhJbmRleCgpIDogdGhpcy5fcmVhZEJvbmVJbmRleCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2xvYWRSaWdpZEJvZGllcygpOiB2b2lkIHtcbiAgICBjb25zdCBjb3VudCA9IHRoaXMuX3JlYWRJbnQzMigpO1xuICAgIHRoaXMuX3JpZ2lkQm9kaWVzID0gbmV3IEFycmF5KGNvdW50KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIHRoaXMuX3JpZ2lkQm9kaWVzW2ldID0ge1xuICAgICAgICByaWdpZEJvZHlOYW1lOiB0aGlzLl9yZWFkVGV4dEJ1ZmZlcigpLFxuICAgICAgICByaWdpZEJvZHlOYW1lRW46IHRoaXMuX3JlYWRUZXh0QnVmZmVyKCksXG4gICAgICAgIGJvbmVJbmRleDogdGhpcy5fcmVhZEJvbmVJbmRleCgpLFxuICAgICAgICBncm91cDogdGhpcy5fcmVhZFVpbnQ4KCksXG4gICAgICAgIHVuQ29sbGlzaW9uR3JvdXBGbGFnOiB0aGlzLl9yZWFkVWludDE2KCksXG4gICAgICAgIHNoYXBlOiB0aGlzLl9yZWFkVWludDgoKSxcbiAgICAgICAgc2l6ZTogW3RoaXMuX3JlYWRGbG9hdDMyKCksIHRoaXMuX3JlYWRGbG9hdDMyKCksIHRoaXMuX3JlYWRGbG9hdDMyKCldLFxuICAgICAgICBwb3NpdGlvbjogW3RoaXMuX3JlYWRGbG9hdDMyKCksIHRoaXMuX3JlYWRGbG9hdDMyKCksIC10aGlzLl9yZWFkRmxvYXQzMigpXSxcbiAgICAgICAgcm90YXRpb246IFt0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpXSxcbiAgICAgICAgbWFzczogdGhpcy5fcmVhZEZsb2F0MzIoKSxcbiAgICAgICAgdHJhbnNsYXRpb25GcmFjdGlvbjogdGhpcy5fcmVhZEZsb2F0MzIoKSxcbiAgICAgICAgcm90YXRpb25GcmFjdGlvbjogdGhpcy5fcmVhZEZsb2F0MzIoKSxcbiAgICAgICAgYm91bmRuZXNzOiB0aGlzLl9yZWFkRmxvYXQzMigpLFxuICAgICAgICBmcmFjdGlvbjogdGhpcy5fcmVhZEZsb2F0MzIoKSxcbiAgICAgICAgY2FsY1R5cGU6IHRoaXMuX3JlYWRVaW50OCgpLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9sb2FkSm9pbnRzKCk6IHZvaWQge1xuICAgIGNvbnN0IGNvdW50ID0gdGhpcy5fcmVhZEludDMyKCk7XG4gICAgdGhpcy5fam9pbnRzID0gbmV3IEFycmF5KGNvdW50KTtcbiAgICBsZXQgdHlwZUNhY2hlID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIHRoaXMuX2pvaW50c1tpXSA9IHtcbiAgICAgICAgam9pbnROYW1lOiB0aGlzLl9yZWFkVGV4dEJ1ZmZlcigpLFxuICAgICAgICBqb2ludE5hbWVFbjogdGhpcy5fcmVhZFRleHRCdWZmZXIoKSxcbiAgICAgICAgam9pbnRUeXBlOiB0eXBlQ2FjaGUgPSB0aGlzLl9yZWFkVWludDgoKSxcbiAgICAgICAgc3ByaW5nOiB0eXBlQ2FjaGUgPT09IDAgP1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRhcmdldFJpZ2lkQm9keTE6IHRoaXMuX3JlYWRSZWdpZEJvZHlJbmRleCgpLFxuICAgICAgICAgICAgdGFyZ2V0UmlnaWRCb2R5MjogdGhpcy5fcmVhZFJlZ2lkQm9keUluZGV4KCksXG4gICAgICAgICAgICBwb3NpdGlvbjogW3RoaXMuX3JlYWRGbG9hdDMyKCksIHRoaXMuX3JlYWRGbG9hdDMyKCksIHRoaXMuX3JlYWRGbG9hdDMyKCldLFxuICAgICAgICAgICAgcm90YXRpb246IFt0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpXSxcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uTGltaXQ6IFt0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpXSxcbiAgICAgICAgICAgIHJvdGF0aW9uTGltaXQ6IFt0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpXSxcbiAgICAgICAgICAgIHNwcmluZ0NvZWZmaWNpZW50TGltaXQ6IFt0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpLCB0aGlzLl9yZWFkRmxvYXQzMigpXVxuICAgICAgICAgIH0gOiB1bmRlZmluZWRcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcmVhZFVURjE2TEVTdHJpbmcobGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIC8vIFdoZW4gdGhpcyB3YXMgVVRGLTE2TEVcbiAgICBjb25zdCB0ZXh0QXJyID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGggLyAyOyBpKyspIHtcbiAgICAgIGNvbnN0IGMgPSB0aGlzLl9yZWFkSW50MTYoKTtcbiAgICAgIGlmIChjID09PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlOyAvLyAgVG8gZGlzY2FyZCBudWxsIGNoYXJcbiAgICAgIH1cbiAgICAgIHRleHRBcnIucHVzaChjKTtcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgdGV4dEFycik7XG4gIH1cblxuICBwcml2YXRlIF9yZWFkVVRGOFN0cmluZyhsZW5ndGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgY29uc3QgdXRmMTYgPSBuZXcgQXJyYXlCdWZmZXIobGVuZ3RoICogMik7XG4gICAgY29uc3QgdXRmMTZWaWV3ID0gbmV3IFVpbnQxNkFycmF5KHV0ZjE2KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICB1dGYxNlZpZXdbaV0gPSB0aGlzLl9yZWFkVWludDgoKTtcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgdXRmMTZWaWV3KTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlYWRVaW50OCgpOiBudW1iZXIge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3JlYWRlci5nZXRVaW50OCh0aGlzLl9vZmZzZXQpO1xuICAgIHRoaXMuX29mZnNldCArPSAxO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIF9yZWFkVWludDE2KCk6IG51bWJlciB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcmVhZGVyLmdldFVpbnQxNih0aGlzLl9vZmZzZXQsIHRydWUpO1xuICAgIHRoaXMuX29mZnNldCArPSAyO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIF9yZWFkVWludDMyKCk6IG51bWJlciB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcmVhZGVyLmdldFVpbnQzMih0aGlzLl9vZmZzZXQsIHRydWUpO1xuICAgIHRoaXMuX29mZnNldCArPSA0O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIF9yZWFkSW50OCgpOiBudW1iZXIge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3JlYWRlci5nZXRJbnQ4KHRoaXMuX29mZnNldCk7XG4gICAgdGhpcy5fb2Zmc2V0ICs9IDE7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgX3JlYWRJbnQxNigpOiBudW1iZXIge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3JlYWRlci5nZXRJbnQxNih0aGlzLl9vZmZzZXQsIHRydWUpO1xuICAgIHRoaXMuX29mZnNldCArPSAyO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIF9yZWFkSW50MzIoKTogbnVtYmVyIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9yZWFkZXIuZ2V0SW50MzIodGhpcy5fb2Zmc2V0LCB0cnVlKTtcbiAgICB0aGlzLl9vZmZzZXQgKz0gNDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVhZEZsb2F0MzIoKTogbnVtYmVyIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9yZWFkZXIuZ2V0RmxvYXQzMih0aGlzLl9vZmZzZXQsIHRydWUpO1xuICAgIHRoaXMuX29mZnNldCArPSA0O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUE1YRGF0YTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
