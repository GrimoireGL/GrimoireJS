interface String {
    format(...replacements: any[]): string;
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, num) {
            if (typeof args[num] != 'undefined') {
                return args[num];
            } else {
                return match;
            }
        });
    };
}


module jThree.Base {
    import Action1 = jThree.Delegates.Action1; /**
     * 
     */
    class JsHack {
        public static getObjectName(obj: any): string {
            var funcNameRegex = /function (.{1,})\(/;
            var result = (funcNameRegex).exec((obj).constructor.toString());
            return (result && result.length > 1) ? result[1] : "";
        }
    }
    /**
     * This interface indicate the class implementing this interface can be transformed into string style.
     * (NOTE:This interface sometimes wouldn't make sense.Entire javascript object has 'Object.prototype.toString'.
     * But,this interface was created to intend to ensure all objects implementing this interface have methods transforming into strings  and it is intended.)
     */
    export interface IStringConvertable {
        toString(): string;
    }

    /**
     *This class indicate the class extends this class is added by jThree.
     */
    export class jThreeObject implements IStringConvertable {
        toString(): string {
            return JsHack.getObjectName(this);
        }

        getTypeName(): string {
            return JsHack.getObjectName(this);
        }
    }

    export class jThreeID
    {
        private static randomChars:string="abcdefghijklmnopqrstuvwxyzABCDEFHIJKLMNOPQRSTUVWXYZ1234567890-";

        public static getUniqueRandom(length: number): string {
            var random: string = "";
            for (var i = 0; i < length; i++) {
                random += jThreeID.randomChars.charAt(Math.random() * jThreeID.randomChars.length);
            }
            return random;
        }
    }

    export class ContextSafeResourceContainer<T> extends jThreeObject
    {
        private context: JThreeContext = null;

        constructor(context:JThreeContext) {
            super();
            this.context = context;
            //Initialize resources for the renderers already subscribed.
            this.context.CanvasRenderers.forEach((v) => {
                this.cachedObject.set(v.ID, this.getInstanceForRenderer(v));
            });
            this.context.onRendererChanged(this.rendererChanged);
        }

        private cachedObject: Map<string, T> = new Map<string, T>();

        public getForRenderer(renderer: RendererBase): T {
            return this.getForRendererID(renderer.ID);
        }

        public getForRendererID(id: string): T {
            return this.cachedObject.get(id);
        }

        protected each(act: Action1<T>): void {
            this.cachedObject.forEach(((v, i, a) => {
                act(v);
            }));
        }

        private rendererChanged(arg:Events.RendererListChangedEventArgs): void {
            switch (arg.ChangeType) {
                case Events.RendererStateChangedType.Add:
                    this.cachedObject.set(arg.AffectedRenderer.ID, this.getInstanceForRenderer(arg.AffectedRenderer));
                    break;
                case Events.RendererStateChangedType.Delete:
                    var delTarget: T = this.cachedObject.get(arg.AffectedRenderer.ID);
                    this.cachedObject.delete(arg.AffectedRenderer.ID);
                    this.disposeResource(delTarget);
                    break;
            }
        }

        protected getInstanceForRenderer(renderer:RendererBase): T {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        protected disposeResource(resource: T): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
    }

    export class jThreeObjectWithID extends jThreeObject
    {
        private id: string;
        /**
         * このオブジェクトを識別するID
         */
        public get ID(): string
        {
            return this.id;
        }
    }
}