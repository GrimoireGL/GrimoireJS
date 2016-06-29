class Logger {
  public static sectionLog(sectionName: string, log: string): void {
    console.log.apply(console, Logger._sectionLogParams(sectionName, log));
  }

  public static sectionWarn(sectionName: string, log: string): void {
    console.warn.apply(console, Logger._sectionLogParams(sectionName, log));
  }

  public static sectionError(sectionName: string, log: string): void {
    console.error.apply(console, Logger._sectionLogParams(sectionName, log));
  }

  public static sectionInfo(sectionName: string, log: string): void {
    console.info.apply(console, Logger._sectionLogParams(sectionName, log));
  }

  public static sectionLongLog(sectionName: string, log: string): void {
    // var params = Logger.sectionLogParams(sectionName,"");
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

  private static _sectionLogParams(sectionName: string, log: string): string[] {
    return ["%c jThree v3 %c▶ " + sectionName + " %c▶%c " + log, "background-color:#344F66;color:white;", "color:#344F66;background-color:#D1D4D7;", "color:#D1D4D7;", ""];
  }
}
export default Logger;
