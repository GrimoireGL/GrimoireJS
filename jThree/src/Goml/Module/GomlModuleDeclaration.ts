import GomlModuleDeclarationBody = require('./GomlModuleDeclarationBody');
interface GomlModuleDeclaration
{
	[name:string]:GomlModuleDeclarationBody;
}

export = GomlModuleDeclaration;