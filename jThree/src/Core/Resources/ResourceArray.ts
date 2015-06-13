
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import JThreeObject = require('../../Base/JThreeObject');

class ResourceArray<T,F extends Function> extends JThreeObject
{
	private creationFunction:F;
	
	private resourceArray:AssociativeArray<T>=new AssociativeArray<T>();
	
	constructor(creationFunction:F)
	{
		super();
		this.creationFunction=creationFunction;
	}
	
	
	public create(id:string,...args){
		if(this.resourceArray.has(id))
		{
			var resource=this.resourceArray.get(id);
			return resource;
		}else{
			resource=this.creationFunction.apply(this,args);
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