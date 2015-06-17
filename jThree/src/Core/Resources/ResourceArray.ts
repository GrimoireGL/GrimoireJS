
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import JThreeObject = require('../../Base/JThreeObject');
import Delegates = require('./../../Delegates')
class ResourceArray<T> extends JThreeObject
{	
	private resourceArray:AssociativeArray<T>=new AssociativeArray<T>();
	
	constructor()
	{
		super();
	}
	
	
	public create(id:string,creationFunc:Delegates.Func0<T>){
		if(this.resourceArray.has(id))
		{
			var resource=this.resourceArray.get(id);
			return resource;
		}else{
			resource=creationFunc();
			this.resourceArray.set(id,resource);
			return resource;
		}
	}
	
	public get(id:string):T
	{
		return this.resourceArray.get(id);
	}
	
	public has(id:string):boolean
	{
		return this.resourceArray.has(id);
	}
	
	public toString():string
	{
		var logInfo:string ="";
		this.resourceArray.forEach((v,k,m)=>{
			logInfo=logInfo+k+"\n";
		});
		return logInfo;
	}
}

export = ResourceArray;