///<reference path="../_references.ts"/>
module jThree.Events {
    import jThreeObject = jThree.Base.jThreeObject;
    /**
     * レンダラーの状況の変更内容を示す列挙体
     */
    export enum RendererStateChangedType
    {
        Add,
        Delete
    }
    /**
     * レンダラーの変更を通知するイベント
     */
    export class RendererListChangedEventArgs extends jThreeObject
    {
        constructor(private changeType: RendererStateChangedType, private affectedRenderer: RendererBase) {
            super();
        }
        
        /**
         * レンダラへの変更の種類
         */
        get ChangeType(): RendererStateChangedType {
            return this.changeType;
        }

        /**
         * 影響を受けたレンダラ
         */
        get AffectedRenderer(): RendererBase {
            return this.affectedRenderer;
        }
    }

}