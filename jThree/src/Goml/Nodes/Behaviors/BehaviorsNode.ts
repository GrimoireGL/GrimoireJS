import GomlTreeNodeBase = require("../../GomlTreeNodeBase");


class BehaviorsNode extends GomlTreeNodeBase
{

  constructor(elem: HTMLElement,parent:GomlTreeNodeBase)
  {
      super(elem,parent);
      this.componentTarget=parent;
      this.attributes.defineAttribute({
          "name": {
              value: 128, converter: "number", handler: (v) => { this.sizeChanged(v.Value,this.attributes.getValue("height")) }
          },
      });
  }

  private componentTarget:GomlTreeNodeBase;

  public get ComponentTarget():GomlTreeNodeBase
  {
    return this.componentTarget;
  }
}

export =BehaviorsNode;
