import SpringJoint from "./Joints/SpringJointData";

interface PMXJointData {
  jointName: string;
  jointNameEn: string;
  jointType: number;
  spring?: SpringJoint;
}


export default PMXJointData;
