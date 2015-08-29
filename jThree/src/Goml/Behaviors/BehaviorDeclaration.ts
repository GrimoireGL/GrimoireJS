import GomlComponentDeclarationBody = require("./BehaviorDeclarationBody");
interface GomlComponentDeclaration
{
	[name:string]:GomlComponentDeclarationBody;
}

export = GomlComponentDeclaration;