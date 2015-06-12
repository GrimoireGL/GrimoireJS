
import AssociativeArray = require('../../Base/Collections/AssociativeArray');
import JThreeObject = require('../../Base/JThreeObject');

class ResourceArray<T,F> extends JThreeObject
{
	private creationFunction:F;
	
	private resourceArray:AssociativeArray<T>=new AssociativeArray<T>();
	
	constructor(creationFunction:F)
	{
		super();
		this.creationFunction=creationFunction;
	}
	
	public create(id:string):F{
		if(this.resourceArray.has(id))
		{
			var resource=this.resourceArray.get(id);
			return <F>(<any>function(){return resource;});
		}else{
			return this.creationFunction;
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
}

export = ResourceArray;