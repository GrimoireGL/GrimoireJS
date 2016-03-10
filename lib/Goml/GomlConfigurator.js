import JThreeObject from "../Base/JThreeObject";
import EasingFunctionList from "./EasingFunctionList";
import GomlConverterList from "./GomlConverterList";
import GomlNodeList from "./GomlNodeList";
/**
 * Provides configurations that will be used when parse GOML.
 * These properties is intended to be used for extending by plugin feature.
 */
class GomlConfigurator extends JThreeObject {
    /**
     * `TagFactory`, `Converter`の定義を行っています
     *
     * `TagFactory`はNodeを生成するために必要です。ここではタグ名とTagFactoryの関連付けを行っております。
     */
    constructor() {
        super();
        /**
         * List of easing function to indicate how animation will be.
         */
        this._easingFunctions = {};
        /**
         * List of converter function classes.
         */
        this._converters = {};
        /**
         * All list of goml tags that will be parsed and instanciated when parse GOML.
         *
         * Keyはタグ名の文字列(大文字)、ValueはGomlNodeのコンストラクタ
         */
        this._gomlNodes = {};
        this._initializeEasingFunctions();
        this._initializeConverters();
        this._initializeGomlNodes();
    }
    getConverter(name) {
        return this._converters[name];
    }
    getEasingFunction(name) {
        return this._easingFunctions[name];
    }
    /**
     * タグ名からGomlNodeを取得します
     *
     * @param  {string} tagName タグ名
     * @return {GomlTreeNodeBase}
     */
    getGomlNode(tagName) {
        return this._gomlNodes[tagName.toUpperCase()];
    }
    /*
    * Initialize associative array for easing functions that will be used for animation in goml.
    */
    _initializeEasingFunctions() {
        const list = EasingFunctionList;
        for (let key in list) {
            const type = list[key];
            this._easingFunctions[key] = new type();
        }
    }
    /**
     * Initialize converters from list.
     */
    _initializeConverters() {
        const list = GomlConverterList;
        for (let key in list) {
            const type = list[key];
            this._converters[key] = new type();
        }
    }
    /**
     * タグ名とNodeの関連付けを行っています。
     */
    _initializeGomlNodes() {
        const newList = GomlNodeList;
        newList.forEach((v) => {
            for (let key in v.NodeTypes) {
                let keyInString = key;
                keyInString = keyInString.toUpperCase(); // transform into upper case
                const nodeType = v.NodeTypes[keyInString]; // nodeTypeはGomlNodeのコンストラクタ
                this._gomlNodes[keyInString] = nodeType;
            }
        });
    }
}
export default GomlConfigurator;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdvbWwvR29tbENvbmZpZ3VyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FDTyxZQUFZLE1BQU0sc0JBQXNCO09BSXhDLGtCQUFrQixNQUFNLHNCQUFzQjtPQUM5QyxpQkFBaUIsTUFBTSxxQkFBcUI7T0FDNUMsWUFBWSxNQUFNLGdCQUFnQjtBQUN6Qzs7O0dBR0c7QUFDSCwrQkFBK0IsWUFBWTtJQWtDekM7Ozs7T0FJRztJQUNIO1FBQ0UsT0FBTyxDQUFDO1FBdkNWOztXQUVHO1FBQ0sscUJBQWdCLEdBQXNDLEVBQUUsQ0FBQztRQUNqRTs7V0FFRztRQUNLLGdCQUFXLEdBQTZDLEVBQUUsQ0FBQztRQUNuRTs7OztXQUlHO1FBQ0ssZUFBVSxHQUFrRCxFQUFFLENBQUM7UUEyQnJFLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUE1Qk0sWUFBWSxDQUFDLElBQVk7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLGlCQUFpQixDQUFDLElBQVk7UUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxXQUFXLENBQUMsT0FBZTtRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBY0Q7O01BRUU7SUFDTSwwQkFBMEI7UUFDaEMsTUFBTSxJQUFJLEdBQUcsa0JBQWtCLENBQUM7UUFDaEMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDMUMsQ0FBQztJQUNILENBQUM7SUFDRDs7T0FFRztJQUNLLHFCQUFxQjtRQUMzQixNQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQztRQUMvQixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDckMsQ0FBQztJQUNILENBQUM7SUFFRDs7T0FFRztJQUNLLG9CQUFvQjtRQUMxQixNQUFNLE9BQU8sR0FBMEIsWUFBWSxDQUFDO1FBQ3BELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLFdBQVcsR0FBVyxHQUFHLENBQUM7Z0JBQzlCLFdBQVcsR0FBRyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyw0QkFBNEI7Z0JBQ3JFLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyw0QkFBNEI7Z0JBQ3ZFLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsUUFBUSxDQUFDO1lBQzFDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDO0FBQ0QsZUFBZSxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJHb21sL0dvbWxDb25maWd1cmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR29tbE5vZGVMaXN0RWxlbWVudCBmcm9tIFwiLi9Hb21sTm9kZUxpc3RFbGVtZW50XCI7XG5pbXBvcnQgSlRocmVlT2JqZWN0IGZyb20gXCIuLi9CYXNlL0pUaHJlZU9iamVjdFwiO1xuaW1wb3J0IEVhc2luZ0Z1bmN0aW9uIGZyb20gXCIuL0Vhc2luZy9FYXNpbmdGdW5jdGlvbkJhc2VcIjtcbmltcG9ydCBBdHRyaWJ1dGVDb252cnRlckJhc2UgZnJvbSBcIi4vQ29udmVydGVyL0F0dHJpYnV0ZUNvbnZlcnRlckJhc2VcIjtcbmltcG9ydCBHb21sVHJlZU5vZGVCYXNlIGZyb20gXCIuL0dvbWxUcmVlTm9kZUJhc2VcIjtcbmltcG9ydCBFYXNpbmdGdW5jdGlvbkxpc3QgZnJvbSBcIi4vRWFzaW5nRnVuY3Rpb25MaXN0XCI7XG5pbXBvcnQgR29tbENvbnZlcnRlckxpc3QgZnJvbSBcIi4vR29tbENvbnZlcnRlckxpc3RcIjtcbmltcG9ydCBHb21sTm9kZUxpc3QgZnJvbSBcIi4vR29tbE5vZGVMaXN0XCI7XG4vKipcbiAqIFByb3ZpZGVzIGNvbmZpZ3VyYXRpb25zIHRoYXQgd2lsbCBiZSB1c2VkIHdoZW4gcGFyc2UgR09NTC5cbiAqIFRoZXNlIHByb3BlcnRpZXMgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZCBmb3IgZXh0ZW5kaW5nIGJ5IHBsdWdpbiBmZWF0dXJlLlxuICovXG5jbGFzcyBHb21sQ29uZmlndXJhdG9yIGV4dGVuZHMgSlRocmVlT2JqZWN0IHtcbiAgLyoqXG4gICAqIExpc3Qgb2YgZWFzaW5nIGZ1bmN0aW9uIHRvIGluZGljYXRlIGhvdyBhbmltYXRpb24gd2lsbCBiZS5cbiAgICovXG4gIHByaXZhdGUgX2Vhc2luZ0Z1bmN0aW9uczogeyBba2V5OiBzdHJpbmddOiBFYXNpbmdGdW5jdGlvbiB9ID0ge307XG4gIC8qKlxuICAgKiBMaXN0IG9mIGNvbnZlcnRlciBmdW5jdGlvbiBjbGFzc2VzLlxuICAgKi9cbiAgcHJpdmF0ZSBfY29udmVydGVyczogeyBba2V5OiBzdHJpbmddOiBBdHRyaWJ1dGVDb252cnRlckJhc2UgfSA9IHt9O1xuICAvKipcbiAgICogQWxsIGxpc3Qgb2YgZ29tbCB0YWdzIHRoYXQgd2lsbCBiZSBwYXJzZWQgYW5kIGluc3RhbmNpYXRlZCB3aGVuIHBhcnNlIEdPTUwuXG4gICAqXG4gICAqIEtleeOBr+OCv+OCsOWQjeOBruaWh+Wtl+WIlyjlpKfmloflrZcp44CBVmFsdWXjga9Hb21sTm9kZeOBruOCs+ODs+OCueODiOODqeOCr+OCv1xuICAgKi9cbiAgcHJpdmF0ZSBfZ29tbE5vZGVzOiB7IFtrZXk6IHN0cmluZ106IG5ldyAoKSA9PiBHb21sVHJlZU5vZGVCYXNlIH0gPSB7fTtcblxuICBwdWJsaWMgZ2V0Q29udmVydGVyKG5hbWU6IHN0cmluZyk6IEF0dHJpYnV0ZUNvbnZydGVyQmFzZSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnZlcnRlcnNbbmFtZV07XG4gIH1cblxuICBwdWJsaWMgZ2V0RWFzaW5nRnVuY3Rpb24obmFtZTogc3RyaW5nKTogRWFzaW5nRnVuY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9lYXNpbmdGdW5jdGlvbnNbbmFtZV07XG4gIH1cblxuICAvKipcbiAgICog44K/44Kw5ZCN44GL44KJR29tbE5vZGXjgpLlj5blvpfjgZfjgb7jgZlcbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0YWdOYW1lIOOCv+OCsOWQjVxuICAgKiBAcmV0dXJuIHtHb21sVHJlZU5vZGVCYXNlfVxuICAgKi9cbiAgcHVibGljIGdldEdvbWxOb2RlKHRhZ05hbWU6IHN0cmluZyk6IG5ldyAoKSA9PiBHb21sVHJlZU5vZGVCYXNlIHtcbiAgICByZXR1cm4gdGhpcy5fZ29tbE5vZGVzW3RhZ05hbWUudG9VcHBlckNhc2UoKV07XG4gIH1cblxuICAvKipcbiAgICogYFRhZ0ZhY3RvcnlgLCBgQ29udmVydGVyYOOBruWumue+qeOCkuihjOOBo+OBpuOBhOOBvuOBmVxuICAgKlxuICAgKiBgVGFnRmFjdG9yeWDjga9Ob2Rl44KS55Sf5oiQ44GZ44KL44Gf44KB44Gr5b+F6KaB44Gn44GZ44CC44GT44GT44Gn44Gv44K/44Kw5ZCN44GoVGFnRmFjdG9yeeOBrumWoumAo+S7mOOBkeOCkuihjOOBo+OBpuOBiuOCiuOBvuOBmeOAglxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pbml0aWFsaXplRWFzaW5nRnVuY3Rpb25zKCk7XG4gICAgdGhpcy5faW5pdGlhbGl6ZUNvbnZlcnRlcnMoKTtcbiAgICB0aGlzLl9pbml0aWFsaXplR29tbE5vZGVzKCk7XG4gIH1cblxuICAvKlxuICAqIEluaXRpYWxpemUgYXNzb2NpYXRpdmUgYXJyYXkgZm9yIGVhc2luZyBmdW5jdGlvbnMgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIGFuaW1hdGlvbiBpbiBnb21sLlxuICAqL1xuICBwcml2YXRlIF9pbml0aWFsaXplRWFzaW5nRnVuY3Rpb25zKCk6IHZvaWQge1xuICAgIGNvbnN0IGxpc3QgPSBFYXNpbmdGdW5jdGlvbkxpc3Q7XG4gICAgZm9yIChsZXQga2V5IGluIGxpc3QpIHtcbiAgICAgIGNvbnN0IHR5cGUgPSBsaXN0W2tleV07XG4gICAgICB0aGlzLl9lYXNpbmdGdW5jdGlvbnNba2V5XSA9IG5ldyB0eXBlKCk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGNvbnZlcnRlcnMgZnJvbSBsaXN0LlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZUNvbnZlcnRlcnMoKTogdm9pZCB7XG4gICAgY29uc3QgbGlzdCA9IEdvbWxDb252ZXJ0ZXJMaXN0O1xuICAgIGZvciAobGV0IGtleSBpbiBsaXN0KSB7XG4gICAgICBjb25zdCB0eXBlID0gbGlzdFtrZXldO1xuICAgICAgdGhpcy5fY29udmVydGVyc1trZXldID0gbmV3IHR5cGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog44K/44Kw5ZCN44GoTm9kZeOBrumWoumAo+S7mOOBkeOCkuihjOOBo+OBpuOBhOOBvuOBmeOAglxuICAgKi9cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZUdvbWxOb2RlcygpOiB2b2lkIHtcbiAgICBjb25zdCBuZXdMaXN0OiBHb21sTm9kZUxpc3RFbGVtZW50W10gPSBHb21sTm9kZUxpc3Q7XG4gICAgbmV3TGlzdC5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdi5Ob2RlVHlwZXMpIHtcbiAgICAgICAgbGV0IGtleUluU3RyaW5nOiBzdHJpbmcgPSBrZXk7XG4gICAgICAgIGtleUluU3RyaW5nID0ga2V5SW5TdHJpbmcudG9VcHBlckNhc2UoKTsgLy8gdHJhbnNmb3JtIGludG8gdXBwZXIgY2FzZVxuICAgICAgICBjb25zdCBub2RlVHlwZSA9IHYuTm9kZVR5cGVzW2tleUluU3RyaW5nXTsgLy8gbm9kZVR5cGXjga9Hb21sTm9kZeOBruOCs+ODs+OCueODiOODqeOCr+OCv1xuICAgICAgICB0aGlzLl9nb21sTm9kZXNba2V5SW5TdHJpbmddID0gbm9kZVR5cGU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IEdvbWxDb25maWd1cmF0b3I7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
