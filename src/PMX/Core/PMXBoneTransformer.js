import Transformer from "../../Core/Transform/Transformer";
import { quat, vec3 } from "gl-matrix";
import Quaternion from "../../Math/Quaternion";
import Vector3 from "../../Math/Vector3";
import Matrix from "../../Math/Matrix";
import JThreeContext from "../../JThreeContext";
class PMXBoneTransformer extends Transformer {
    constructor(sceneObj, pmx, index) {
        super(sceneObj);
        this.userRotation = Quaternion.Identity;
        this.transformUpdated = false;
        this.userTranslation = Vector3.Zero;
        this.isIKLink = false;
        this._morphRotation = Quaternion.Identity;
        this._morphTranslation = Vector3.Zero;
        this._providingBoneRotation = Quaternion.Identity;
        this._providingBoneTranslation = Vector3.Zero;
        this._ikLinkRotation = Quaternion.Identity;
        this._pmx = pmx;
        this._boneIndex = index;
    }
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
    _updateLocalRotation() {
        quat.identity(this.Rotation.rawElements);
        if (this.IsRotationProvidingBone) {
            if (this.IsLocalProvidingBone) {
                console.error("Local providing is not implemented yet!");
            }
            if (this.ProvidingBoneTransformer.isIKLink) {
                quat.slerp(this.Rotation.rawElements, this.Rotation.rawElements, this.ProvidingBoneTransformer._ikLinkRotation.rawElements, this.BoneData.providingRate);
            }
        }
        quat.mul(this.Rotation.rawElements, this.Rotation.rawElements, this.userRotation.rawElements);
        quat.mul(this.Rotation.rawElements, this.Rotation.rawElements, this._morphRotation.rawElements);
        if (this.IsRotationProvidingBone) {
            quat.copy(this._providingBoneRotation.rawElements, this.Rotation.rawElements);
        }
        quat.mul(this.Rotation.rawElements, this.Rotation.rawElements, this._ikLinkRotation.rawElements);
    }
    _updateLocalTranslation() {
        this.Position.rawElements[0] = 0;
        this.Position.rawElements[1] = 0;
        this.Position.rawElements[2] = 0;
        if (this.IsTranslationProvidingBone) {
            if (this.IsLocalProvidingBone) {
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
        let dot = Vector3.dot(effector, target);
        if (dot > 1.0) {
            dot = 1.0;
        }
        const rotationAngle = this._clampFloat(Math.acos(dot), rotationLimit);
        if (isNaN(rotationAngle)) {
            return;
        }
        if (rotationAngle <= 1.0e-3) {
            return;
        }
        const rotationAxis = Vector3.cross(effector, target).normalizeThis();
        const rotation = Quaternion.angleAxis(rotationAngle, rotationAxis);
        const restrictedRotation = this._restrictRotation(ikLink, rotation);
        link._ikLinkRotation = Quaternion.multiply(link._ikLinkRotation, restrictedRotation);
        link.updateTransformForPMX();
    }
    _getIkLinkTransformerByIndex(index) {
        return this._pmx.skeleton.getBoneByIndex(this.BoneData.ikLinks[index].ikLinkBoneIndex).Transformer;
    }
    _restrictRotation(link, rot) {
        if (!link.isLimitedRotation) {
            return rot;
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
//# sourceMappingURL=PMXBoneTransformer.js.map