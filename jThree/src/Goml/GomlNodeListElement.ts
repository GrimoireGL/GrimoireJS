import JThreeObject = require("../Base/JThreeObject");

class GomlNodeListElement extends JThreeObject
{
  private group:string;

  private factory:any;

  private nodeTypes:{[key:string]:any};

  constructor(group:string,factory:any,nodeTypes:{[key:string]:any})
  {
    super();
    this.group=group;
    this.nodeTypes=nodeTypes;
    this.factory=factory;
  }

  public get Group():string
  {
    return this.group;
  }

  public get NodeTypes():{[key:string]:any}
  {
    return this.nodeTypes;
  }

  public get Factory():any
  {
    return this.factory;
  }
}

export=GomlNodeListElement;
