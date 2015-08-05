import SpringJoint = require("Joints/SpringJoint");

interface PMXJoint
{
	jointName:string;
	jointNameEn:string;
	jointType:number;
	spring?:SpringJoint;
}


export =PMXJoint;
