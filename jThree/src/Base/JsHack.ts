class JsHack {
    public static getObjectName(obj: any): string {
      if (!String.prototype["format"]) {
          String.prototype["format"] = function () {
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
        var funcNameRegex = /function (.{1,})\(/;
        var result = (funcNameRegex).exec((obj).constructor.toString());
        return (result && result.length > 1) ? result[1] : "";
    }
}

export=JsHack;
