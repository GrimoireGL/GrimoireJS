import AreaLight from "../../../../Core/SceneObjects/Light/Impl/AreaLight";
import LightNodeBase from "./LightNodeBase";
class AreaLightNode extends LightNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "intensity": {
                value: 1,
                converter: "float",
                onchanged: this._onIntensityAttrChanged.bind(this),
            }
        });
        this.on("update-scene-object", (obj) => {
            this._onIntensityAttrChanged.call(this, this.attributes.getAttribute("intensity"));
        });
    }
    __constructLight() {
        return new AreaLight();
    }
    _onIntensityAttrChanged(attr) {
        if (this.TargetSceneObject) {
            this.TargetSceneObject.intensity = attr.Value;
            attr.done();
        }
    }
}
export default AreaLightNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvTm9kZXMvU2NlbmVPYmplY3RzL0xpZ2h0cy9BcmVhTGlnaHROb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLFNBQVMsTUFBTSxvREFBb0Q7T0FDbkUsYUFBYSxNQUFNLGlCQUFpQjtBQUczQyw0QkFBNEIsYUFBYTtJQUN2QztRQUNFLE9BQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO1lBQzlCLFdBQVcsRUFBRTtnQkFDWCxLQUFLLEVBQUUsQ0FBQztnQkFDUixTQUFTLEVBQUUsT0FBTztnQkFDbEIsU0FBUyxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ25EO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEdBQWM7WUFDNUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNyRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFUyxnQkFBZ0I7UUFDeEIsTUFBTSxDQUFDLElBQUksU0FBUyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVPLHVCQUF1QixDQUFDLElBQW1CO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsaUJBQWtCLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDM0QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQsZUFBZSxhQUFhLENBQUMiLCJmaWxlIjoiR29tbC9Ob2Rlcy9TY2VuZU9iamVjdHMvTGlnaHRzL0FyZWFMaWdodE5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXJlYUxpZ2h0IGZyb20gXCIuLi8uLi8uLi8uLi9Db3JlL1NjZW5lT2JqZWN0cy9MaWdodC9JbXBsL0FyZWFMaWdodFwiO1xuaW1wb3J0IExpZ2h0Tm9kZUJhc2UgZnJvbSBcIi4vTGlnaHROb2RlQmFzZVwiO1xuaW1wb3J0IEdvbWxBdHRyaWJ1dGUgZnJvbSBcIi4uLy4uLy4uL0dvbWxBdHRyaWJ1dGVcIjtcblxuY2xhc3MgQXJlYUxpZ2h0Tm9kZSBleHRlbmRzIExpZ2h0Tm9kZUJhc2U8QXJlYUxpZ2h0PiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5hdHRyaWJ1dGVzLmRlZmluZUF0dHJpYnV0ZSh7XG4gICAgICBcImludGVuc2l0eVwiOiB7XG4gICAgICAgIHZhbHVlOiAxLFxuICAgICAgICBjb252ZXJ0ZXI6IFwiZmxvYXRcIixcbiAgICAgICAgb25jaGFuZ2VkOiB0aGlzLl9vbkludGVuc2l0eUF0dHJDaGFuZ2VkLmJpbmQodGhpcyksXG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5vbihcInVwZGF0ZS1zY2VuZS1vYmplY3RcIiwgKG9iajogQXJlYUxpZ2h0KSA9PiB7XG4gICAgICB0aGlzLl9vbkludGVuc2l0eUF0dHJDaGFuZ2VkLmNhbGwodGhpcywgdGhpcy5hdHRyaWJ1dGVzLmdldEF0dHJpYnV0ZShcImludGVuc2l0eVwiKSk7XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX19jb25zdHJ1Y3RMaWdodCgpOiBBcmVhTGlnaHQge1xuICAgIHJldHVybiBuZXcgQXJlYUxpZ2h0KCk7XG4gIH1cblxuICBwcml2YXRlIF9vbkludGVuc2l0eUF0dHJDaGFuZ2VkKGF0dHI6IEdvbWxBdHRyaWJ1dGUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5UYXJnZXRTY2VuZU9iamVjdCkge1xuICAgICAgKDxBcmVhTGlnaHQ+dGhpcy5UYXJnZXRTY2VuZU9iamVjdCkuaW50ZW5zaXR5ID0gYXR0ci5WYWx1ZTtcbiAgICAgIGF0dHIuZG9uZSgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcmVhTGlnaHROb2RlO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
