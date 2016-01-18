// import Scene = require("../../Scene");;
// import LightBase = require("./../LightBase");;
// import LightTypeDeclaration = require("./../LightTypeDeclaration");
// import BasicRenderer = require("../../Renderers/BasicRenderer");
// import Matrix = require("../../../Math/Matrix");
// import Vector3 = require("../../../Math/Vector3");
// /**
//  * Point Light
//  * Parameter order
//  * 0:X:TypeID YZW:Color.RGB*Intencity
//  * 1:XYZ:Position
//  * 2:XYZ:Direction
//  * 3:X:Innner Cone,Y:Outer Cone,Z:Decay
//  */
// class SpotLight extends LightBase
// {
// 	constructor(scene:Scene)
// 	{
// 		super(scene);
// 	}
// 	public intensity:number=1.0;
//
// 	public decay:number=1;
//
// 	public inner:number=0.3;
//
// 	public outer:number=0.7;
//
// 	public get LightType():string
// 	{
// 		return "jthree.lights.spotlight";
//     }
//
//     public getParameters(renderer:BasicRenderer): number[]
//     {
// 			　var pos;
// 			 var matVM =Matrix.multiply(renderer.Camera.viewMatrix,this.Transformer.LocalToGlobal);
// 			  pos = Matrix.transformPoint(matVM,Vector3.Zero);
// 				var dir = new Vector3(0,-1,0);
// 				dir = Matrix.transformNormal(matVM,dir);
//         return [this.Color.R * this.intensity, this.Color.G * this.intensity, this.Color.B * this.intensity,
//             pos.X,pos.Y,pos.Z, 0,
// 						dir.X,dir.Y,dir.Z,0,
//         Math.cos(this.inner),Math.cos(this.outer),this.decay];
//     }
//
//     public static get TypeDefinition(): LightTypeDeclaration {
//         return {
//             typeName: "jthree.lights.spotlight",
//             requiredParamCount: 3,
//             shaderfuncName: "calcSpotLight",
//             diffuseFragmentCode: require('../../Shaders/Light/Spot/DiffuseChunk.glsl'),
//             specularFragmentCode:require("../../Shaders/Light/Spot/SpecularChunk.glsl")
//         };
//     }
// }
//
// export = SpotLight;
