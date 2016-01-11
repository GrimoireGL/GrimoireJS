
import AssociativeArray = require("../../Base/Collections/AssociativeArray");
import JThreeObject = require("../../Base/JThreeObject");
import Delegates = require("./../../Base/Delegates")
class ResourceArray<T> extends JThreeObject
{
	private resourceArray:{[key:string]:T} = {};

	private handlerArray:AssociativeArray<Delegates.Action1<T>[]>=new AssociativeArray<Delegates.Action1<T>[]>();

	constructor()
	{
		super();
	}


	public create(id:string,creationFunc:Delegates.Func0<T>){
		if(this.resourceArray[id])
		{
			var resource=this.resourceArray[id];
			return resource;
		}else{
			resource=creationFunc();
			this.resourceArray[id] = resource;
			var handlers=this.handlerArray.get(id);
			if(handlers)handlers.forEach(v=>v(resource));
			return resource;
		}
	}

	public get(id:string):T
	{
		return this.resourceArray[id];
	}

	public has(id:string):boolean
	{
		return !!this.resourceArray[id];
	}

	public getHandler(id:string,handler:Delegates.Action1<T>)
	{
		if(this.has(id))
			handler(this.get(id));
		else
		{
			if(this.handlerArray.has(id))
				this.handlerArray.get(id).push(handler);
			else
			{
				this.handlerArray.set(id,[handler]);
			}
		}
	}
}

export = ResourceArray;
