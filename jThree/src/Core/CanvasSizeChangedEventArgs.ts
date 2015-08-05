import CanvasManager = require("./CanvasManager");

class CanvasSizeChangedEventArg
{
	private targetCanvasManager:CanvasManager;
	private lastWidth:number;
	private lastHeight:number;
	private newWidth:number;
	private newHeight:number;
	constructor(target:CanvasManager,lastWidth:number,lastHeight:number,newWidth:number,newHeight:number)
	{
		this.targetCanvasManager=target;
		this.lastWidth=lastWidth;
		this.lastHeight=lastHeight;
		this.newWidth=newWidth;
		this.newHeight=newHeight;
	}
	
	public get TargetCanvas():CanvasManager
	{
		return this.targetCanvasManager;
	}
	
	public get LastWidth():number
	{
		return this.lastWidth;
	}
	
	public get LastHeight():number
	{
		return this.lastHeight;
	}
	
	public get NewWidth():number
	{
		return this.newWidth;
	}
	
	public get NewHeight():number
	{
		return this.newHeight;
	}
}

export = CanvasSizeChangedEventArg;