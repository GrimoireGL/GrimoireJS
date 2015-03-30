///<reference path="../_references.ts"/>

module jThree
{
    import jThreeObject = jThree.Base.jThreeObject;
    import VectorBase = jThree.Mathematics.Vector.VectorBase;
    import Enumerable = jThree.Collections.IEnumerable;

    export interface IVectorFactory<T extends VectorBase> {
        fromEnumerable(en: Enumerable<number>): T;
        fromArray(arr:number[]):T;
    }


    export class JThreeContext extends jThreeObject
    {
        
    }

    export class CanvasRenderer extends jThreeObject
    {
        public static fromCanvas(canvas:HTMLCanvasElement): CanvasRenderer {
            var gl: WebGLRenderingContext;
            try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                return new CanvasRenderer(gl);
            } catch(e){
                if (!gl) {
                    //Processing for this error
                }
            }
        }

        private glContext: WebGLRenderingContext;

        constructor(glContext?:WebGLRenderingContext) {
            super();
            this.glContext = glContext;
        }
    }
}
