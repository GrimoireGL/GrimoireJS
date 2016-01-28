import SpringJoint from "./Joints/SpringJoint";

interface PMXJoint {
  jointName: string;
  jointNameEn: string;
  jointType: number;
  spring?: SpringJoint;
}


export default PMXJoint;
