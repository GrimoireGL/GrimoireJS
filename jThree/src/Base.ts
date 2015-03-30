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
    /**
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
    }
}