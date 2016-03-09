import Transformer from "../../Core/Transform/Transformer";
import { quat, vec3 } from "gl-matrix";
import Quaternion from "../../Math/Quaternion";
import Vector3 from "../../Math/Vector3";
import Matrix from "../../Math/Matrix";
import JThreeContext from "../../JThreeContext";
/**
 * Bone transformer for pmx
 */
class PMXBoneTransformer extends Transformer {
    constructor(sceneObj, pmx, index) {
        super(sceneObj);
        /**
         * Quaternion produced from manual operation,bone animation.(except bone morphs)
         * @type {Quaternion}
         */
        this.userRotation = Quaternion.Identity;
        this.transformUpdated = false;
        /**
           * Translation vector produced from manual operation,bone animation.
           * @type {Vector3}
           */
        this.userTranslation = Vector3.Zero;
        /**
         * Whether this bone transformer is IKLink or not.
         * This variable will be assigned by PMXSkeleton after loading all bones.
         * @type {boolean}
         */
        this.isIKLink = false;
        /**
         * Quaternion produced from bone morphs.
         * @type {Quaternion}
         */
        this._morphRotation = Quaternion.Identity;
        /**
         * Translation vector produced from bone morphs.
         * @type {Vector3}
         */
        this._morphTranslation = Vector3.Zero;
        /**
         * Quaternion that will be used for calculating rotation providing for child bones.
         * @type {Quaternion}
         */
        this._providingBoneRotation = Quaternion.Identity;
        /**
         * Translation vector that will be used for calculating translation providing for child bones.
         * @type {Vector3}
         */
        this._providingBoneTranslation = Vector3.Zero;
        /**
         * Quaternion produced from rotation of IK link.
         * @type {Quaternion}
         */
        this._ikLinkRotation = Quaternion.Identity;
        this._pmx = pmx;
        this._boneIndex = index;
    }
    /**
     * Reference to static model data.
     */
    get PMXModelData() {
        return this._pmx.ModelData;
    }
    get BoneData() {
        return this.PMXModelData.Bones[this._boneIndex];
    }
    get ProvidingBone() {
        return this._pmx.skeleton.getBoneByIndex(this.BoneData.providingBoneIndex);
    }
    get ProvidingBoneTransformer() {
        return this.ProvidingBone.Transformer;
    }
    get IsLocalProvidingBone() {
        return (this.BoneData.boneFlag & 0x0080) > 0;
    }
    get IsRotationProvidingBone() {
        return (this.BoneData.boneFlag & 0x0100) > 0;
    }
    get IsTranslationProvidingBone() {
        return (this.BoneData.boneFlag & 0x0200) > 0;
    }
    get IsIKBone() {
        return (this.BoneData.boneFlag & 0x0020) > 0;
    }
    updateTransform() {
        super.updateTransform();
    }
    updateTransformForPMX() {
        if (this._pmx == null) {
            return;
        }
        this._updateLocalTranslation();
        if (this.IsIKBone && this._pmx.skeleton) {
            this._applyCCDIK();
            const debug = JThreeContext.getContextComponent(6);
            debug.setInfo("Bone " + this.BoneData.boneName, this.Position.toString());
        }
        else {
            this._updateLocalRotation();
            super.updateTransform();
        }
    }
    /**
     * Calculate actual rotation quaternion.
     * This operation not affects any other bones.(Even if the bone was child bone)
     * @return {[type]} [description]
     */
    _updateLocalRotation() {
        quat.identity(this.Rotation.rawElements);
        if (this.IsRotationProvidingBone) {
            if (this.IsLocalProvidingBone) {
                // TODO Do something when this bone is local providing bone
                console.error("Local providing is not implemented yet!");
            }
            if (this.ProvidingBoneTransformer.isIKLink) {
                // Interpolate ikLink rotation with providing rate
                quat.slerp(this.Rotation.rawElements, this.Rotation.rawElements, this.ProvidingBoneTransformer._ikLinkRotation.rawElements, this.BoneData.providingRate);
            }
        }
        // Multiply local rotations of this bone
        quat.mul(this.Rotation.rawElements, this.Rotation.rawElements, this.userRotation.rawElements);
        quat.mul(this.Rotation.rawElements, this.Rotation.rawElements, this._morphRotation.rawElements);
        if (this.IsRotationProvidingBone) {
            quat.copy(this._providingBoneRotation.rawElements, this.Rotation.rawElements);
        }
        // Calculate IkLink rotation of this bone
        quat.mul(this.Rotation.rawElements, this.Rotation.rawElements, this._ikLinkRotation.rawElements);
    }
    /**
     * Calculate actual translation vector.
     * This operation not affects any other bones.(Even if the bone was child bone)
     * @return {[type]} [description]
     */
    _updateLocalTranslation() {
        this.Position.rawElements[0] = 0;
        this.Position.rawElements[1] = 0;
        this.Position.rawElements[2] = 0;
        if (this.IsTranslationProvidingBone) {
            if (this.IsLocalProvidingBone) {
                // Do something when this bone is local providing bone
                console.error("Local providing is not implemented yet!");
            }
            vec3.lerp(this.Position.rawElements, this.Position.rawElements, this.ProvidingBone.Transformer.Position.rawElements, this.BoneData.providingRate);
        }
        vec3.add(this.Position.rawElements, this.Position.rawElements, this.userTranslation.rawElements);
        vec3.add(this.Position.rawElements, this.Position.rawElements, this._morphTranslation.rawElements);
        if (this.IsTranslationProvidingBone) {
            vec3.copy(this._providingBoneTranslation.rawElements, this.Position.rawElements);
        }
    }
    _applyCCDIK() {
        for (let i = 0; i < this.BoneData.ikLinkCount; i++) {
            const link = this._getIkLinkTransformerByIndex(i);
            link._ikLinkRotation = Quaternion.Identity;
            link.updateTransformForPMX();
        }
        for (let i = 0; i < this.BoneData.ikLoopCount; i++) {
            this._cCDIKOperation(i);
        }
    }
    _cCDIKOperation(it) {
        const effectorTransformer = this._pmx.skeleton.getBoneByIndex(this.BoneData.ikTargetBoneIndex).Transformer;
        const TargetGlobalPos = Matrix.transformPoint(this.LocalToGlobal, this.LocalOrigin);
        // vec3.transformMat4(this._pmxCalcCacheVec, this.LocalOrigin.rawElements, this.LocalToGlobal.rawElements);
        for (let i = 0; i < this.BoneData.ikLinkCount; i++) {
            const ikLinkData = this.BoneData.ikLinks[i];
            const ikLinkTransform = this._getIkLinkTransformerByIndex(i);
            const link2Effector = this._getLink2Effector(ikLinkTransform, effectorTransformer);
            const link2Target = this._getLink2Target(ikLinkTransform, TargetGlobalPos);
            this._ikLinkCalc(ikLinkTransform, link2Effector, link2Target, this.BoneData.ikLimitedRotation, ikLinkData, it);
        }
    }
    _getLink2Effector(link, effector) {
        const ToLinkLocal = Matrix.inverse(link.LocalToGlobal);
        const ep = effector.LocalOrigin;
        const local2effectorLocal = Matrix.multiply(ToLinkLocal, effector.LocalToGlobal);
        const effectorPos = Matrix.transformPoint(local2effectorLocal, ep);
        return effectorPos.subtractWith(link.LocalOrigin).normalizeThis();
    }
    _getLink2Target(link, tp) {
        const ToLinkLocal = Matrix.inverse(link.LocalToGlobal);
        const effectorPos = Matrix.transformPoint(ToLinkLocal, tp);
        return effectorPos.subtractWith(link.LocalOrigin).normalizeThis();
    }
    _ikLinkCalc(link, effector, target, rotationLimit, ikLink, it) {
        // Calculate rotation angle
        let dot = Vector3.dot(effector, target);
        if (dot > 1.0) {
            dot = 1.0; // adjust error (if dot was over 1.0, acos(dot) will be NaN. Then, it cause some of bug)
        }
        const rotationAngle = this._clampFloat(Math.acos(dot), rotationLimit);
        if (isNaN(rotationAngle)) {
            return;
        }
        if (rotationAngle <= 1.0e-3) {
            return;
        }
        // Calculate rotation axis of rotation
        const rotationAxis = Vector3.cross(effector, target).normalizeThis();
        // Generate the rotation matrix rotating along the axis
        const rotation = Quaternion.angleAxis(rotationAngle, rotationAxis);
        // link.updateTransform();
        // Rotation = (_providingBoneRotation) * userRotation * _morphRotation * ikLinkRotation
        // RestrictedRotation = Rotation * ikLinkAdjust
        // ikLinkAdust = (Rotation) ^ -1 * RestrictedRotation
        const restrictedRotation = this._restrictRotation(ikLink, rotation);
        link._ikLinkRotation = Quaternion.multiply(link._ikLinkRotation, restrictedRotation);
        link.updateTransformForPMX();
        // link.updateTransformMatricies();
    }
    _getIkLinkTransformerByIndex(index) {
        return this._pmx.skeleton.getBoneByIndex(this.BoneData.ikLinks[index].ikLinkBoneIndex).Transformer;
    }
    _restrictRotation(link, rot) {
        if (!link.isLimitedRotation) {
            return rot; // If this link bone is not enabled with rotation limit,just return.
        }
        const decomposed = rot.factoringQuaternionXYZ();
        const xRotation = Math.max(link.limitedRotation[0], Math.min(link.limitedRotation[3], -decomposed.x));
        const yRotation = Math.max(link.limitedRotation[1], Math.min(link.limitedRotation[4], -decomposed.y));
        const zRotation = Math.max(link.limitedRotation[2], Math.min(link.limitedRotation[5], decomposed.z));
        return Quaternion.eulerXYZ(-xRotation, -yRotation, zRotation);
    }
    _clampFloat(f, limit) {
        return Math.max(Math.min(f, limit), -limit);
    }
}
export default PMXBoneTransformer;
