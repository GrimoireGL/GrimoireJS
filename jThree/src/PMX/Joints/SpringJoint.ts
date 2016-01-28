interface SpringJoint {
  targetRigidBody1: number;
  targetRigidBody2: number;
  position: number[];
  rotation: number[];
  translationLimit: number[]; // [minX,minY,minZ,maxX,maxY,maxZ]
  rotationLimit: number[]; // [minX,minY,minZ,maxX,maxY,maxZ]
  springCoefficientLimit: number[]; // [minX,minY,minZ,maxX,maxY,maxZ]
}

export = SpringJoint;
