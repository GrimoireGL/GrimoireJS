import GomlTreeNodeBase from "../../GomlTreeNodeBase";

class TemplateNode extends GomlTreeNodeBase {
  // private static parentIgnore: string[] = ["template"];

  // private static templateIgnore: string[] = ["name"];

  private _templateGoml: string = "";

  public get TemplateGoml(): string {
    return this._templateGoml;
  }

  constructor() {
    super();
    // var name=elem.getAttribute("name");
    // if(name)
    // {
    //   this.nodeManager.nodeRegister.addObject("jthree.template",name,this);
    //   this.templateGoml=elem.innerHTML;
    // }else{
    //   console.error("template tag should be specified name.")
    // }
  }

  public getGomlToInstanciate(instanciateParent: HTMLElement): string {
    // var valueMap:{[key:string]:string}={};
    // var templateAttributes=this.element.attributes;
    // for (var i = 0; i < templateAttributes.length; i++) {
    //   var attribute = templateAttributes.item(i);
    //   if(TemplateNode.templateIgnore.indexOf(attribute.name)===-1)
    //   {
    //     valueMap[attribute.name]=attribute.value;
    //   }
    // }
    // var instanciateParentAttributes=instanciateParent.attributes;
    // for (var i = 0; i < instanciateParentAttributes.length; i++) {
    //   var attribute = instanciateParentAttributes.item(i);
    //   if(TemplateNode.parentIgnore.indexOf(attribute.name)===-1)
    //   {
    //     valueMap[attribute.name]=attribute.value;
    //   }
    // }
    // var replaceTarget:string = this.TemplateGoml;
    // for(var replaceKey in valueMap)
    // {
    //   var value = valueMap[replaceKey];
    //   replaceTarget=replaceTarget.replace(`{{${replaceKey}}}`,value);
    // }
    // return replaceTarget;
    return "";
  }

}

export default TemplateNode;
