import SceneObjectNodeBase from "./SceneObjectNodeBase";
import SceneObject from "../../../Core/SceneObjects/SceneObject";
// import GomlParser from "../../GomlParser.ts";
class ObjectNode extends SceneObjectNodeBase {
    // private targetTemplate: TemplateNode;
    constructor() {
        super();
        // TODO: pnly
        // var templateName=elem.getAttribute("template");
        // if(templateName)
        // {
        //   this.targetTemplate=<TemplateNode>this.nodeManager.nodeRegister.getObject("jthree.template",templateName);
        // GomlParser.instanciateTemplate(this.targetTemplate.GetGomlToInstanciate(this.element),this);
        // }
    }
    __onMount() {
        super.__onMount();
        this.TargetSceneObject = new SceneObject();
    }
}
export default ObjectNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZXMvU2NlbmVPYmplY3RzL09iamVjdE5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sbUJBQW1CLE1BQU0sdUJBQXVCO09BQ2hELFdBQVcsTUFBTSx3Q0FBd0M7QUFDaEUsZ0RBQWdEO0FBRWhELHlCQUF5QixtQkFBbUI7SUFDMUMsd0NBQXdDO0lBRXhDO1FBQ0UsT0FBTyxDQUFDO1FBQ1IsYUFBYTtRQUNiLGtEQUFrRDtRQUNsRCxtQkFBbUI7UUFDbkIsSUFBSTtRQUNKLCtHQUErRztRQUMvRywrRkFBK0Y7UUFDL0YsSUFBSTtJQUNOLENBQUM7SUFFUyxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0FBQ0gsQ0FBQztBQUVELGVBQWUsVUFBVSxDQUFDIiwiZmlsZSI6IkdvbWwvTm9kZXMvU2NlbmVPYmplY3RzL09iamVjdE5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2NlbmVPYmplY3ROb2RlQmFzZSBmcm9tIFwiLi9TY2VuZU9iamVjdE5vZGVCYXNlXCI7XG5pbXBvcnQgU2NlbmVPYmplY3QgZnJvbSBcIi4uLy4uLy4uL0NvcmUvU2NlbmVPYmplY3RzL1NjZW5lT2JqZWN0XCI7XG4vLyBpbXBvcnQgR29tbFBhcnNlciBmcm9tIFwiLi4vLi4vR29tbFBhcnNlci50c1wiO1xuXG5jbGFzcyBPYmplY3ROb2RlIGV4dGVuZHMgU2NlbmVPYmplY3ROb2RlQmFzZTxTY2VuZU9iamVjdD4ge1xuICAvLyBwcml2YXRlIHRhcmdldFRlbXBsYXRlOiBUZW1wbGF0ZU5vZGU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvLyBUT0RPOiBwbmx5XG4gICAgLy8gdmFyIHRlbXBsYXRlTmFtZT1lbGVtLmdldEF0dHJpYnV0ZShcInRlbXBsYXRlXCIpO1xuICAgIC8vIGlmKHRlbXBsYXRlTmFtZSlcbiAgICAvLyB7XG4gICAgLy8gICB0aGlzLnRhcmdldFRlbXBsYXRlPTxUZW1wbGF0ZU5vZGU+dGhpcy5ub2RlTWFuYWdlci5ub2RlUmVnaXN0ZXIuZ2V0T2JqZWN0KFwianRocmVlLnRlbXBsYXRlXCIsdGVtcGxhdGVOYW1lKTtcbiAgICAvLyBHb21sUGFyc2VyLmluc3RhbmNpYXRlVGVtcGxhdGUodGhpcy50YXJnZXRUZW1wbGF0ZS5HZXRHb21sVG9JbnN0YW5jaWF0ZSh0aGlzLmVsZW1lbnQpLHRoaXMpO1xuICAgIC8vIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfX29uTW91bnQoKTogdm9pZCB7XG4gICAgc3VwZXIuX19vbk1vdW50KCk7XG4gICAgdGhpcy5UYXJnZXRTY2VuZU9iamVjdCA9IG5ldyBTY2VuZU9iamVjdCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE9iamVjdE5vZGU7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
