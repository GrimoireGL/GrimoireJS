/**
 * Something tricky static methods for javascript.
 */
class JsHack {
    /**
     * Obtain the class name of passed object.
     * @param  {any}    obj any object to get class name for
     * @return {string}   obtained name
     */
    public static getObjectName(obj: any): string {
        const funcNameRegex = /function (.{1,})\(/;
        const result = (funcNameRegex).exec((obj).constructor.toString());
        return (result && result.length > 1) ? result[1] : "";
    }
}

export = JsHack;
