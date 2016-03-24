import GomlTreeNodeBase from "../../GomlTreeNodeBase";
class TemplateNode extends GomlTreeNodeBase {
    constructor() {
        super();
        // private static parentIgnore: string[] = ["template"];
        // private static templateIgnore: string[] = ["name"];
        this._templateGoml = "";
        // var name=elem.getAttribute("name");
        // if(name)
        // {
        //   this.nodeManager.nodeRegister.addObject("jthree.template",name,this);
        //   this.templateGoml=elem.innerHTML;
        // }else{
        //   console.error("template tag should be specified name.")
        // }
    }
    get TemplateGoml() {
        return this._templateGoml;
    }
    getGomlToInstanciate(instanciateParent) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZXMvVGVtcGxhdGVzL1RlbXBsYXRlTm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxnQkFBZ0IsTUFBTSx3QkFBd0I7QUFFckQsMkJBQTJCLGdCQUFnQjtJQVd6QztRQUNFLE9BQU8sQ0FBQztRQVhWLHdEQUF3RDtRQUV4RCxzREFBc0Q7UUFFOUMsa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFRakMsc0NBQXNDO1FBQ3RDLFdBQVc7UUFDWCxJQUFJO1FBQ0osMEVBQTBFO1FBQzFFLHNDQUFzQztRQUN0QyxTQUFTO1FBQ1QsNERBQTREO1FBQzVELElBQUk7SUFDTixDQUFDO0lBZEQsSUFBVyxZQUFZO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7SUFjTSxvQkFBb0IsQ0FBQyxpQkFBOEI7UUFDeEQseUNBQXlDO1FBQ3pDLGtEQUFrRDtRQUNsRCx3REFBd0Q7UUFDeEQsZ0RBQWdEO1FBQ2hELGlFQUFpRTtRQUNqRSxNQUFNO1FBQ04sZ0RBQWdEO1FBQ2hELE1BQU07UUFDTixJQUFJO1FBQ0osZ0VBQWdFO1FBQ2hFLGlFQUFpRTtRQUNqRSx5REFBeUQ7UUFDekQsK0RBQStEO1FBQy9ELE1BQU07UUFDTixnREFBZ0Q7UUFDaEQsTUFBTTtRQUNOLElBQUk7UUFDSixnREFBZ0Q7UUFDaEQsa0NBQWtDO1FBQ2xDLElBQUk7UUFDSixzQ0FBc0M7UUFDdEMsb0VBQW9FO1FBQ3BFLElBQUk7UUFDSix3QkFBd0I7UUFDeEIsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNaLENBQUM7QUFFSCxDQUFDO0FBRUQsZUFBZSxZQUFZLENBQUMiLCJmaWxlIjoiR29tbC9Ob2Rlcy9UZW1wbGF0ZXMvVGVtcGxhdGVOb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdvbWxUcmVlTm9kZUJhc2UgZnJvbSBcIi4uLy4uL0dvbWxUcmVlTm9kZUJhc2VcIjtcblxuY2xhc3MgVGVtcGxhdGVOb2RlIGV4dGVuZHMgR29tbFRyZWVOb2RlQmFzZSB7XG4gIC8vIHByaXZhdGUgc3RhdGljIHBhcmVudElnbm9yZTogc3RyaW5nW10gPSBbXCJ0ZW1wbGF0ZVwiXTtcblxuICAvLyBwcml2YXRlIHN0YXRpYyB0ZW1wbGF0ZUlnbm9yZTogc3RyaW5nW10gPSBbXCJuYW1lXCJdO1xuXG4gIHByaXZhdGUgX3RlbXBsYXRlR29tbDogc3RyaW5nID0gXCJcIjtcblxuICBwdWJsaWMgZ2V0IFRlbXBsYXRlR29tbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZUdvbWw7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIC8vIHZhciBuYW1lPWVsZW0uZ2V0QXR0cmlidXRlKFwibmFtZVwiKTtcbiAgICAvLyBpZihuYW1lKVxuICAgIC8vIHtcbiAgICAvLyAgIHRoaXMubm9kZU1hbmFnZXIubm9kZVJlZ2lzdGVyLmFkZE9iamVjdChcImp0aHJlZS50ZW1wbGF0ZVwiLG5hbWUsdGhpcyk7XG4gICAgLy8gICB0aGlzLnRlbXBsYXRlR29tbD1lbGVtLmlubmVySFRNTDtcbiAgICAvLyB9ZWxzZXtcbiAgICAvLyAgIGNvbnNvbGUuZXJyb3IoXCJ0ZW1wbGF0ZSB0YWcgc2hvdWxkIGJlIHNwZWNpZmllZCBuYW1lLlwiKVxuICAgIC8vIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRHb21sVG9JbnN0YW5jaWF0ZShpbnN0YW5jaWF0ZVBhcmVudDogSFRNTEVsZW1lbnQpOiBzdHJpbmcge1xuICAgIC8vIHZhciB2YWx1ZU1hcDp7W2tleTpzdHJpbmddOnN0cmluZ309e307XG4gICAgLy8gdmFyIHRlbXBsYXRlQXR0cmlidXRlcz10aGlzLmVsZW1lbnQuYXR0cmlidXRlcztcbiAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBsYXRlQXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgdmFyIGF0dHJpYnV0ZSA9IHRlbXBsYXRlQXR0cmlidXRlcy5pdGVtKGkpO1xuICAgIC8vICAgaWYoVGVtcGxhdGVOb2RlLnRlbXBsYXRlSWdub3JlLmluZGV4T2YoYXR0cmlidXRlLm5hbWUpPT09LTEpXG4gICAgLy8gICB7XG4gICAgLy8gICAgIHZhbHVlTWFwW2F0dHJpYnV0ZS5uYW1lXT1hdHRyaWJ1dGUudmFsdWU7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuICAgIC8vIHZhciBpbnN0YW5jaWF0ZVBhcmVudEF0dHJpYnV0ZXM9aW5zdGFuY2lhdGVQYXJlbnQuYXR0cmlidXRlcztcbiAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IGluc3RhbmNpYXRlUGFyZW50QXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgdmFyIGF0dHJpYnV0ZSA9IGluc3RhbmNpYXRlUGFyZW50QXR0cmlidXRlcy5pdGVtKGkpO1xuICAgIC8vICAgaWYoVGVtcGxhdGVOb2RlLnBhcmVudElnbm9yZS5pbmRleE9mKGF0dHJpYnV0ZS5uYW1lKT09PS0xKVxuICAgIC8vICAge1xuICAgIC8vICAgICB2YWx1ZU1hcFthdHRyaWJ1dGUubmFtZV09YXR0cmlidXRlLnZhbHVlO1xuICAgIC8vICAgfVxuICAgIC8vIH1cbiAgICAvLyB2YXIgcmVwbGFjZVRhcmdldDpzdHJpbmcgPSB0aGlzLlRlbXBsYXRlR29tbDtcbiAgICAvLyBmb3IodmFyIHJlcGxhY2VLZXkgaW4gdmFsdWVNYXApXG4gICAgLy8ge1xuICAgIC8vICAgdmFyIHZhbHVlID0gdmFsdWVNYXBbcmVwbGFjZUtleV07XG4gICAgLy8gICByZXBsYWNlVGFyZ2V0PXJlcGxhY2VUYXJnZXQucmVwbGFjZShge3ske3JlcGxhY2VLZXl9fX1gLHZhbHVlKTtcbiAgICAvLyB9XG4gICAgLy8gcmV0dXJuIHJlcGxhY2VUYXJnZXQ7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBUZW1wbGF0ZU5vZGU7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
