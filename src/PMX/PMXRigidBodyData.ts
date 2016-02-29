interface PMXRigidBodyData {
  rigidBodyName: string;
  rigidBodyNameEn: string;
  boneIndex: number;
  group: number;
  unCollisionGroupFlag: number;
  shape: number;
  size: number[];
  position: number[];
  rotation: number[];
  mass: number;
  translationFraction: number;
  rotationFraction: number;
  boundness: number;
  fraction: number;
  calcType: number;
}

export default PMXRigidBodyData;
