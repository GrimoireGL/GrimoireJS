import JThreeObject = require("../Base/JThreeObject");

class GomlNodeListElement extends JThreeObject
{
  private group:string;

  private nodeTypes:{[key:string]:any};

  constructor(group:string,nodeTypes:{[key:string]:any})
  {
    super();
    this.group=group;
    this.nodeTypes=nodeTypes;
  }

  public get Group():string
  {
    return this.group;
  }

  public get NodeTypes():{[key:string]:any}
  {
    return this.nodeTypes;
  }
}

export=GomlNodeListElement;
