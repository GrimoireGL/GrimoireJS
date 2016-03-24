import XModel from "../Core/XModel";
import SceneObjectNodeBase from "./../../Goml/Nodes/SceneObjects/SceneObjectNodeBase";
class XNode extends SceneObjectNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "src": {
                converter: "string",
                value: undefined,
                constant: true
            }
        });
    }
    __onMount() {
        super.__onMount();
        XModel.fromUrl(this.attributes.getValue("src"))
            .then((m) => {
            this.TargetSceneObject = m;
        });
    }
}
export default XNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlgvR29tbC9YTm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxNQUFNLE1BQU0sZ0JBQWdCO09BQzVCLG1CQUFtQixNQUFNLHFEQUFxRDtBQUVyRixvQkFBb0IsbUJBQW1CO0lBRXJDO1FBQ0UsT0FBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7WUFDOUIsS0FBSyxFQUFFO2dCQUNMLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixLQUFLLEVBQUUsU0FBUztnQkFDaEIsUUFBUSxFQUFFLElBQUk7YUFDZjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFUyxTQUFTO1FBQ2pCLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNsQixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzVDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUixJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUM7QUFFRCxlQUFlLEtBQUssQ0FBQyIsImZpbGUiOiJYL0dvbWwvWE5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgWE1vZGVsIGZyb20gXCIuLi9Db3JlL1hNb2RlbFwiO1xuaW1wb3J0IFNjZW5lT2JqZWN0Tm9kZUJhc2UgZnJvbSBcIi4vLi4vLi4vR29tbC9Ob2Rlcy9TY2VuZU9iamVjdHMvU2NlbmVPYmplY3ROb2RlQmFzZVwiO1xuXG5jbGFzcyBYTm9kZSBleHRlbmRzIFNjZW5lT2JqZWN0Tm9kZUJhc2U8WE1vZGVsPiB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmF0dHJpYnV0ZXMuZGVmaW5lQXR0cmlidXRlKHtcbiAgICAgIFwic3JjXCI6IHtcbiAgICAgICAgY29udmVydGVyOiBcInN0cmluZ1wiLFxuICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICBjb25zdGFudDogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9fb25Nb3VudCgpOiB2b2lkIHtcbiAgICBzdXBlci5fX29uTW91bnQoKTtcbiAgICBYTW9kZWwuZnJvbVVybCh0aGlzLmF0dHJpYnV0ZXMuZ2V0VmFsdWUoXCJzcmNcIikpXG4gICAgICAudGhlbigobSkgPT4ge1xuICAgICAgdGhpcy5UYXJnZXRTY2VuZU9iamVjdCA9IG07XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgWE5vZGU7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
