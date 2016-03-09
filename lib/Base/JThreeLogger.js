class JThreeLogger {
    static sectionLog(sectionName, log) {
        console.log.apply(console, JThreeLogger._sectionLogParams(sectionName, log));
    }
    static sectionWarn(sectionName, log) {
        console.warn.apply(console, JThreeLogger._sectionLogParams(sectionName, log));
    }
    static sectionError(sectionName, log) {
        console.error.apply(console, JThreeLogger._sectionLogParams(sectionName, log));
    }
    static sectionInfo(sectionName, log) {
        console.info.apply(console, JThreeLogger._sectionLogParams(sectionName, log));
    }
    static sectionLongLog(sectionName, log) {
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
    static _sectionLogParams(sectionName, log) {
        return ["%c jThree v3 %c▶ " + sectionName + " %c▶%c " + log, "background-color:#344F66;color:white;", "color:#344F66;background-color:#D1D4D7;", "color:#D1D4D7;", ""];
    }
}
export default JThreeLogger;
