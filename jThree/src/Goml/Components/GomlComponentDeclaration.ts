import GomlComponentDeclarationBody = require("./GomlComponentDeclarationBody");
interface GomlComponentDeclaration
{
	[name:string]:GomlComponentDeclarationBody;
}

export = GomlComponentDeclaration;