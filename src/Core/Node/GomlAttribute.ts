// import EEObject from "../Base/EEObject";
// import AttributeConverter from "./AttributeConverter";
// import GomlConfigurator from "./GomlConfigurator";
//
// /**
//  * Provides the feature to manage attribute of Goml.
//  */
// class GomlAttribute extends EEObject {
//
//
//     private _name: string;
//     private _namespace: string;
//     private _defaultValue: any;
//
//     /**
//      * Attributeが初期化されていることを示すinitializedのフラグを建て、attributeが更新された際のeventが有効になるようにします。
//      *
//      * このメソッドはGomlNodeのインスタンスが生成された後に呼ばれ、GomlNodeのコンストラクタ内でset:Valueが呼ばれてもeventは発生しません。
//      */
//     public initialize(): void {
//         // if (this._value === undefined) {
//         //     console.warn(`Attribute ${this.Name} is undefined.`);
//         // }
//         // this.initialized = true;
//         // if (!this.constant && this.listeners("changed").length !== 0) {
//         //     // 通常時のAttributeの初期化
//         //     // onchangeのイベントのコールバック内でdoneでdeferredが解決される
//         //     this.emit("changed", this);
//         // }
//     }
//
//     public get Name(): string {
//         return this._name;
//     }
//
//     public get Namespace(): string {
//       return this._namespace;
//     }
//
//
//
//
//
//
//
//
//     /**
//      * Use this method when you emit chenge event.
//      * Do not use #emit()
//      *
//      * on change event will be fired when #initialized property is true.
//      * When this attribute is reserved and #initializeSequence is true, change event will also be fired even if not initilized.
//      */
//     public notifyValueChanged(): void {
//         if (this.constant) {
//             return;
//         }
//         if (this.initialized) {
//             this.emit("changed", this);
//         }
//     }
// }
//
// export default GomlAttribute;
