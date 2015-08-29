import BehaviorDeclarationBody = require("./BehaviorDeclarationBody");
interface BehaviorDeclaration
{
	[name:string]:BehaviorDeclarationBody;
}

export = BehaviorDeclaration;