class JThreeLogger {
    public static sectionLog(sectionName: string, log: string) {
        console.log.apply(console, JThreeLogger.sectionLogParams(sectionName, log));
    }

    public static sectionWarn(sectionName: string, log: string) {
        console.warn.apply(console, JThreeLogger.sectionLogParams(sectionName, log));
    }

    public static sectionError(sectionName: string, log: string) {
        console.error.apply(console, JThreeLogger.sectionLogParams(sectionName, log));
    }

    public static sectionInfo(sectionName: string, log: string) {
        console.info.apply(console, JThreeLogger.sectionLogParams(sectionName, log));
    }

    public static sectionLongLog(sectionName: string, log: string) {
        // var params = JThreeLogger.sectionLogParams(sectionName,"");
        // var logLines = log.split('\n');
        // var entireLog="\n";
        // for (let i = 0; i < logLines.length; i++) {
        //     var line = `%c ${i+1} %c▶%c ${logLines[i]}\n`;
        //     params.push("background-color:#344F66;color:white;","color:#344F66;","");
        //     entireLog+=line;
        // }
        // params[0]+=entireLog;
        // console.log.apply(console,params);
    }

    private static sectionLogParams(sectionName: string, log: string) {
        return ["%c jThree v3 %c▶ " + sectionName + " %c▶%c " + log, "background-color:#344F66;color:white;", "color:#344F66;background-color:#D1D4D7;", "color:#D1D4D7;", ""];
    }
}
export = JThreeLogger;
