class JsHack {
    public static getObjectName(obj: any): string {
        var funcNameRegex = /function (.{1,})\(/;
        var result = (funcNameRegex).exec((obj).constructor.toString());
        return (result && result.length > 1) ? result[1] : "";
    }
}

export=JsHack;
