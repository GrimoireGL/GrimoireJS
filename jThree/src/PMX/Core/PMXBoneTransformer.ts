import Transformer from "../../Core/Transform/Transformer";
import SceneObject from "../../Core/SceneObjects/SceneObject";
import PMXModel from "./PMXModel";
import {quat, vec3} from "gl-matrix";
import Quaternion from "../../Math/Quaternion";
import Vector3 from "../../Math/Vector3";
import Matrix from "../../Math/Matrix";
import PMXIKLink from "../PMXIKLinkData";

/**
 * Bone transformer for pmx
 */
class PMXBoneTransformer extends Transformer {
	/**
	 * Quaternion produced from manual operation,bone animation.(except bone morphs)
	 * @type {Quaternion}
	 */
  public userRotation: Quaternion = Quaternion.Identity;

  public transformUpdated = false;

  /**
	 * Translation vector produced from manual operation,bone animation.
	 * @type {Vector3}
	 */
  public userTranslation: Vector3 = Vector3.Zero;


  /**
   * Whether this bone transformer is IKLink or not.
   * This variable will be assigned by PMXSkeleton after loading all bones.
   * @type {boolean}
   */
  public isIKLink: boolean = false;

	/**
	 * Quaternion produced from bone morphs.
	 * @type {Quaternion}
	 */
  private morphRotation: Quaternion = Quaternion.Identity;

	/**
	 * Translation vector produced from bone morphs.
	 * @type {Vector3}
	 */
  private morphTranslation: Vector3 = Vector3.Zero;

	/**
	 * Quaternion that will be used for calculating rotation providing for child bones.
	 * @type {Quaternion}
	 */
  private providingRotation: Quaternion = Quaternion.Identity;

	/**
	 * Translation vector that will be used for calculating translation providing for child bones.
	 * @type {Vector3}
	 */
  private providingTranslation: Vector3 = Vector3.Zero;

  /**
   * Reference to PMXModel managing all dynamic features.
   * @type {PMXModel}
   */
  private pmx: PMXModel;

  /**
   * Bone index for bone array of skeleton.
   * @type {number}
   */
  private boneIndex: number;

  /**
   * Quaternion produced from rotation of IK link.
   * @type {Quaternion}
   */
  private ikLinkRotation: Quaternion = Quaternion.Identity;

  constructor(sceneObj: SceneObject, pmx: PMXModel, index: number) {
    super(sceneObj);
    this.pmx = pmx;
    this.boneIndex = index;
  }


  /**
   * Reference to static model data.
   */
  public get PMXModelData() {
    return this.pmx.ModelData;
  }

  public get BoneData() {
    return this.PMXModelData.Bones[this.boneIndex];
  }

  public get ProvidingBone() {
    return this.pmx.skeleton.getBoneByIndex(this.BoneData.providingBoneIndex);
  }

  public get ProvidingBoneTransformer() {
    return <PMXBoneTransformer>this.ProvidingBone.Transformer;
  }

  public get IsLocalProvidingBone() {
    return (this.BoneData.boneFlag & 0x0080) > 0;
  }

  public get IsRotationProvidingBone() {
    return (this.BoneData.boneFlag & 0x0100) > 0;
  }

  public get IsTranslationProvidingBone() {
    return (this.BoneData.boneFlag & 0x0200) > 0;
  }

  public get IsIKBone() {
    return (this.BoneData.boneFlag & 0x0020) > 0;
  }

  public updateTransform(): void {
    super.updateTransform();
  }

  public updateTransformForPMX() {
    if (this.pmx == null) {
      return;
    }
    this.updateLocalTranslation();
    if (this.IsIKBone && this.pmx.skeleton) {
      this.applyCCDIK();
    } else {
      this.updateLocalRotation();
      super.updateTransform();
    }
  }
	/**
	 * Calculate actual rotation quaternion.
	 * This operation not affects any other bones.(Even if the bone was child bone)
	 * @return {[type]} [description]
	 */
  private updateLocalRotation() {
    quat.identity(this.Rotation.rawElements);
    if (this.IsRotationProvidingBone) {
      if (this.IsLocalProvidingBone) {
        // TODO Do something when this bone is local providing bone
        console.error("Local providing is not implemented yet!");
      }
      if (this.ProvidingBoneTransformer.isIKLink) {
        // Interpolate ikLink rotation with providing rate
        quat.slerp(this.Rotation.rawElements, this.Rotation.rawElements, this.ProvidingBoneTransformer.ikLinkRotation.rawElements, this.BoneData.providingRate);
      }
    }
    // Multiply local rotations of this bone
    quat.mul(this.Rotation.rawElements, this.Rotation.rawElements, this.userRotation.rawElements);
    quat.mul(this.Rotation.rawElements, this.Rotation.rawElements, this.morphRotation.rawElements);
    if (this.IsRotationProvidingBone) { // Memorize providing rotation of this bone
      quat.copy(this.providingRotation.rawElements, this.Rotation.rawElements);
    }
    // Calculate IkLink rotation of this bone
    quat.mul(this.Rotation.rawElements, this.Rotation.rawElements, this.ikLinkRotation.rawElements);
  }

	/**
	 * Calculate actual translation vector.
	 * This operation not affects any other bones.(Even if the bone was child bone)
	 * @return {[type]} [description]
	 */
  private updateLocalTranslation() {
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
    vec3.add(this.Position.rawElements, this.Position.rawElements, this.morphTranslation.rawElements);
    if (this.IsTranslationProvidingBone) {
      vec3.copy(this.providingTranslation.rawElements, this.Position.rawElements);
    }
  }

  private applyCCDIK() {
    for (let i = 0; i < this.BoneData.ikLinkCount; i++) {
      const link = this.getIkLinkTransformerByIndex(i);
      link.ikLinkRotation = Quaternion.Identity;
      link.updateTransformForPMX();
    }
    for (let i = 0; i < this.BoneData.ikLoopCount; i++) {
      this.CCDIKOperation(i);
    }
  }

  private CCDIKOperation(it: number) {
    const effectorTransformer = <PMXBoneTransformer> this.pmx.skeleton.getBoneByIndex(this.BoneData.ikTargetBoneIndex).Transformer;
    const TargetGlobalPos = Matrix.transformPoint(this.LocalToGlobal, this.LocalOrigin);
    // vec3.transformMat4(this.pmxCalcCacheVec, this.LocalOrigin.rawElements, this.LocalToGlobal.rawElements);
    for (let i = 0; i < this.BoneData.ikLinkCount; i++) {
      const ikLinkData = this.BoneData.ikLinks[i];
      const ikLinkTransform = this.getIkLinkTransformerByIndex(i);
      const link2Effector = this.getLink2Effector(ikLinkTransform, effectorTransformer);
      const link2Target = this.getLink2Target(ikLinkTransform, TargetGlobalPos);
      this.ikLinkCalc(ikLinkTransform, link2Effector, link2Target, this.BoneData.ikLimitedRotation, ikLinkData, it);
    }
  }

  private getLink2Effector(link: PMXBoneTransformer, effector: PMXBoneTransformer) {
    const ToLinkLocal = Matrix.inverse(link.LocalToGlobal);
    const ep = effector.LocalOrigin;
    const local2effectorLocal = Matrix.multiply(ToLinkLocal, effector.LocalToGlobal);
    const effectorPos = Matrix.transformPoint(local2effectorLocal, ep);
    return effectorPos.subtractWith(link.LocalOrigin).normalizeThis();
  }

  private getLink2Target(link: PMXBoneTransformer, tp: Vector3) {
    const ToLinkLocal = Matrix.inverse(link.LocalToGlobal);
    const effectorPos = Matrix.transformPoint(ToLinkLocal, tp);
    return effectorPos.subtractWith(link.LocalOrigin).normalizeThis();
  }

  private ikLinkCalc(link: PMXBoneTransformer, effector: Vector3, target: Vector3, rotationLimit: number, ikLink: PMXIKLink, it: number) {
    // Calculate rotation angle
    let dot = Vector3.dot(effector, target);
    if (dot > 1.0) {
      dot = 1.0; // adjust error (if dot was over 1.0, acos(dot) will be NaN. Then, it cause some of bug)
    }
    const rotationAngle = this.clampFloat(Math.acos(dot), rotationLimit);
    if (isNaN(rotationAngle)) {
      return;
    }
    if (rotationAngle <= 1.0e-3) {
      return;
    }
    // Calculate rotation axis of rotation
    const rotationAxis = Vector3.cross(effector, target).normalizeThis();

    // Generate the rotation matrix rotating along the axis
    const rotation = Quaternion.AngleAxis(rotationAngle, rotationAxis);
    link.ikLinkRotation = rotation;
    link.updateTransformForPMX();
    // link.updateTransform();
    // Rotation = (providingRotation) * userRotation * morphRotation * ikLinkRotation
    // RestrictedRotation = Rotation * ikLinkAdjust
    // ikLinkAdust = (Rotation) ^ -1 * RestrictedRotation
    const restrictedRotation = this.RestrictRotation(ikLink, link.Rotation);
    const ikLinkAdust = Quaternion.multiply(link.Rotation.Inverse(), restrictedRotation);
    link.ikLinkRotation = Quaternion.multiply(link.ikLinkRotation, ikLinkAdust);
    link.updateTransformForPMX();
    // link.updateTransformMatricies();
  }

  private getIkLinkTransformerByIndex(index: number): PMXBoneTransformer {
    return <PMXBoneTransformer>this.pmx.skeleton.getBoneByIndex(this.BoneData.ikLinks[index].ikLinkBoneIndex).Transformer;
  }

  private RestrictRotation(link: PMXIKLink, rot: Quaternion): Quaternion {
    if (!link.isLimitedRotation) {
      return rot; // If this link bone is not enabled with rotation limit,just return.
    }
    const decomposed = rot.FactoringQuaternionXYZ();
    const xRotation = Math.max(link.limitedRotation[0], Math.min(link.limitedRotation[3], -decomposed.x));
    const yRotation = Math.max(link.limitedRotation[1], Math.min(link.limitedRotation[4], -decomposed.y));
    const zRotation = Math.max(link.limitedRotation[2], Math.min(link.limitedRotation[5], decomposed.z));
    return Quaternion.EulerXYZ(-xRotation, -yRotation, zRotation);
  }

  private clampFloat(f: number, limit: number) {
    return Math.max(Math.min(f, limit), -limit);
  }
}

export default PMXBoneTransformer;
