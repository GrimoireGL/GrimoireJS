import GomlModuleDeclrartion = require('./GomlModuleDeclaration');
import GomlModuleDeclarationBody = require('./GomlModuleDeclarationBody');
import JThreeObject = require('../../Base/JThreeObject');
class GomlModule extends JThreeObject
{
	constructor(moduleBody:GomlModuleDeclarationBody)
	{
		super();
		if(typeof moduleBody.order !== 'undefined')this.cachedOrder=moduleBody.order;
		if(moduleBody.attributes)
		{
			
		}
	}
	
	
	private cachedOrder:number=1000;
	public get order():number
	{
		return this.cachedOrder;
	}
	
	private cachedEnabled:boolean =false;
	public get enabled():boolean
	{
		return this.cachedEnabled;
	}
	
	public set enabled(en:boolean)
	{
		this.cachedEnabled=en;
	}
	
}
export = GomlModule;